const express = require('express');
const router = express.Router();
const db = require('ocore/db');
const conf = require('ocore/conf');
var ValidationUtils = require('ocore/validation_utils.js');

function sendError(err, status, res) {
	console.error('Error:', err)
	let error = 'Server Error'
	if (err.message) error = err.message
	if (typeof err === 'string' || err instanceof String ) error = err
	if (res) res.status(status).send( { error } )
	return false;
}

router.get('/:address', async (req, res) => {
	try {
		const address = req.params.address;
		if (!ValidationUtils.isValidAddress(address)) return [];

		var assets = await db.query(
			`SELECT a.unit FROM assets AS a, unit_authors AS u
			WHERE u.address = ? AND a.unit = u.unit`,
			[global.firstAddress]);

		var moreAssets = conf.allowedExternalAssets.filter(unit => (unit && unit !== 'base'));
		assets = assets.map(row => (row.unit)).concat(moreAssets.map(unit => (unit)));
		assets = assets.filter((v,i,a)=>a.indexOf(v)===i);

		var balances = await db.query(
			`SELECT asset, SUM(amount) AS amount FROM outputs
			WHERE address = ? AND is_spent = 0
				AND asset IN (${assets.map(db.escape).join(', ')})
			GROUP BY asset`, [address] );

		res.send(balances);
	}
	catch (err) { return sendError(err, 500, res) }
});

module.exports = router;
