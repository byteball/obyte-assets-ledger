const express = require('express');
const router = express.Router();
const db = require('ocore/db');
const conf = require('ocore/conf');
const constants = require('ocore/constants')

function sendError(err, status, res) {
	console.error('Error:', err)
	let error = 'Server Error'
	if (err.message) error = err.message
	if (typeof err === 'string' || err instanceof String ) error = err
	if (res) res.status(status).send( { error } )
	return false;
}

router.get('/:asset?', async (req, res) => {
	try {
		var
			tokensIssued = null,
			tokensOnExternalAddreses = null,
			tokensOnChangeAddress = 0,
			tokensOnFirstAddress = 0,
			tokensOnOtherAddresses = 0,
			otherAddresses = [],
			i, headlessWalletOutputs;

		if (!req.params.asset || req.params.asset === 'base') {
			tokensIssued = constants.TOTAL_WHITEBYTES
			//** include bytes on Headless Wallet Addresses only ** //
			headlessWalletOutputs = await db.query(
				`SELECT o.address, SUM(o.amount) AS amount FROM outputs AS o, my_addresses AS m
				WHERE o.asset is NULL AND o.address = m.address AND o.is_spent = 0
				GROUP BY o.asset, o.address`, );
		}
		else {
			var assets = await db.query(
				`SELECT a.unit FROM assets AS a, unit_authors AS u
				WHERE u.address = ? AND a.unit = u.unit`,
				[global.firstAddress]);

			var moreAssets = conf.allowedExternalAssets.filter(unit => (unit && unit !== 'base'));
			assets = assets.map(row => (row.unit)).concat(moreAssets.map(unit => (unit)));
			assets = assets.filter((v,i,a)=>a.indexOf(v)===i);

			if (!assets.includes(req.params.asset)) {
				return sendError('No Asset found.', 400, res)
			}

			headlessWalletOutputs = await db.query(
				`SELECT o.address, SUM(o.amount) AS amount FROM outputs AS o, my_addresses AS m
				WHERE o.asset = ? AND o.address = m.address AND o.is_spent = 0
				GROUP BY o.asset, o.address`, [req.params.asset] );

			var issueInputs = await db.query(
				`SELECT SUM(amount) AS amount FROM inputs
				WHERE asset = ? AND type = 'issue' GROUP BY asset`, [req.params.asset] );
			tokensIssued = issueInputs.length ? issueInputs[0].amount : null;
		}

		for (i in headlessWalletOutputs) {
			var output = headlessWalletOutputs[i]
			if (output.address === global.changeAddress) tokensOnChangeAddress = output.amount
			else if (output.address === global.firstAddress) tokensOnFirstAddress = output.amount
			else {
				tokensOnOtherAddresses += output.amount
				otherAddresses.push(output)
			}
		}
		tokensOnExternalAddreses = tokensIssued !== null ? tokensIssued - (tokensOnOtherAddresses + tokensOnFirstAddress + tokensOnChangeAddress) : null;

		res.send({
			tokensIssued: tokensIssued,
			tokensOnExternalAddreses: tokensOnExternalAddreses,
			tokensOnChangeAddress: tokensOnChangeAddress,
			tokensOnFirstAddress: tokensOnFirstAddress,
			tokensOnOtherAddresses: tokensOnOtherAddresses,
			otherAddresses: otherAddresses
		});
	}
	catch (err) { return sendError(err, 500, res) }
});

module.exports = router;
