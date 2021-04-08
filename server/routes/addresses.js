const express = require('express');
const router = express.Router();
var headlessWallet = require('headless-obyte');
const db = require('ocore/db');

function sendError(err, status, res) {
	console.error('Error: ', err)
	let error = 'Server Error'
	if (err.message) error = err.message
	if (typeof err === 'string' || err instanceof String ) error = err
	res.status(status).send( { error: error } )
}

router.get('/', async (req, res) => {
  try {
    var addresses = await db.query(
      `SELECT address, creation_date, address_index FROM my_addresses
      WHERE address_index <> 0
      ORDER BY address_index ASC`);
    res.send(addresses)
  }
  catch (err) { return sendError(err, 500, res) }
});

router.post('/', async (req, res) => {
  try {
    const nextAddress = await headlessWallet.issueNextMainAddress();
    res.status(201);
    res.send({ address: nextAddress })
  }
  catch (err) { return sendError(err, 500, res) }
})

module.exports = router;
