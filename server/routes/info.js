const express = require('express');
const router = express.Router();
const db = require('ocore/db');
const conf = require('ocore/conf');
const network = require('ocore/network');
const storage = require('ocore/storage');
const constants = require('ocore/constants');

function sendError(err, status, res) {
	console.error('Error:', err)
	let error = 'Server Error'
	if (err.message) error = err.message
	if (typeof err === 'string' || err instanceof String ) error = err
	if (res) res.status(status).send( { error } )
	return false;
}

router.get('/', async (req, res) => {
	try {
		var state = [];
		var connections = network.getConnectionStatus();
		state.push({key: 'version', value: conf.bLight ? constants.minCoreVersion : constants.minCoreVersionForFullNodes});
		state.push({key: 'subversion', value: conf.program +' '+ conf.program_version});
		state.push({key: 'protocolversion', value: constants.version});
		state.push({key: 'alt', value: constants.alt});
		state.push({key: 'light_node', value: conf.bLight});
		state.push({key: 'payout_address', value: conf.payout_address || null});
		state.push({key: 'hub/relay', value: conf.hub});
		state.push({key: 'connections', value: connections.incoming + connections.outgoing});
		storage.readLastMainChainIndex(function(last_mci){
			state.push({key: 'last_mci', value: last_mci});
			storage.readLastStableMcIndex(db, function(last_stable_mci){
				state.push({key: 'last_stable_mci', value: last_stable_mci});
				db.query("SELECT COUNT(*) AS count_unhandled FROM unhandled_joints", function(rows){
					state.push({key: 'count_unhandled', value: rows[0].count_unhandled});
					res.send({
						firstAddress: global.firstAddress,
						changeAddress: global.changeAddress,
						state
					})
				});
			});
		});
	}
	catch (err) { return sendError(err, 500, res) }
});

module.exports = router;
