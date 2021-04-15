"use strict";
const express = require('express');
const router = express.Router();
const db = require('ocore/db');
const conf = require('ocore/conf');
var headlessWallet = require('headless-obyte');
var network = require('ocore/network.js');
var divisibleAsset = require('ocore/divisible_asset.js');
var ValidationUtils = require('ocore/validation_utils.js');

function sendError(err, status, res) {
	console.error('Error: ', err)
	let error = 'Server Error'
	if (err.message) error = err.message
	if (typeof err === 'string' || err instanceof String ) error = err
	res.status(status).send( { error: error } )
}

async function validate(data, txn, res) {
	try {
		if (!data.asset || !data.amount) {
			return sendError('Missing data. Asset and amount must be set.', 400, res)
		}
		else if (data.asset === 'base') {
			return sendError('Invalid asset. Bytes cannot be transferred between addresses.', 400, res)
		}
		else if ( (txn === 'buy' || txn === 'sell') && !ValidationUtils.isValidAddress(data.address) ) {
			return sendError('Invalid Address. Valid address required for buy and sell.', 400, res)
		}
		else if ( (txn === 'buy' || txn === 'sell') && data.address === firstAddress) {
			return sendError('Invalid Address. Can not buy or sell with 1st Address.', 400, res)
		}
		else if ( txn === 'sell' && data.address === changeAddress) {
			return sendError('Invalid Address. Can not sell from Change Address.', 400, res)
		}
		else if ( txn === 'move' && (!ValidationUtils.isValidAddress(data.fromAddress) || !ValidationUtils.isValidAddress(data.toAddress)) ) {
			return sendError('Invalid Address. fromAddress and toAddress are both needed.', 400, res)
		}
		else if ( !Number.isInteger(Number(data.amount)) || Number(data.amount) <= 0 ) {
			return sendError('Invalid Amount. Amount must be integer.', 400, res)
		}
		else if ( txn === 'burn' ) {
			var assetFound = await db.query(
				`SELECT a.unit FROM assets AS a, unit_authors AS u
				WHERE u.address = ? AND u.unit = ? AND a.unit = u.unit`,
				[firstAddress, data.asset]);

			if (assetFound.length === 0) {
				return sendError('Invalid Asset. Not burnable asset.', 400, res)
			}
			else return true
		}
		else return true
	} catch (err) { return sendError(err, 500, res); }
}

// ** Buy ** //
router.post('/buy/', async (req, res) => {
	try {
		const data = req.body
		const valid = await validate(data, 'buy', res)
		if (!valid) return false;

		let amount = Number(data.amount);
		divisibleAsset.composeAndSaveDivisibleAssetPaymentJoint({
			paying_addresses: [ changeAddress, firstAddress ],
			fee_paying_addresses: [ changeAddress, firstAddress ],
			change_address: changeAddress,
			asset: data.asset,
			to_address: data.address,
			amount,
			signer: headlessWallet.signer,
			callbacks: {
				ifError: function(err) { sendError(err, 500, res) },
				ifNotEnoughFunds: function(err) { sendError(err, 500, res) },
				ifOk: function(objJoint, arrChains){
					network.broadcastJoint(objJoint);
					//console.error('objJoint: ', objJoint.unit)
					res.status(201);
					res.send( {unit: objJoint.unit.unit } )
				}
			}
		});
	}
	catch (err) {
		return sendError(err, 500, res) }
})

// ** Sell ** //
router.post('/sell/', async (req, res) => {
	try {
		const data = req.body
		const valid = await validate(data, 'sell', res)
		if (!valid) return false;

		var addresses = await db.query(
			`SELECT address FROM my_addresses
			WHERE address_index <> 0 AND address = ?`, [data.address]);
		if (!addresses.length) return sendError('Invalid address. address must be headless wallet address', 400, res)

		let amount = Number(data.amount);
		divisibleAsset.composeAndSaveDivisibleAssetPaymentJoint({
			paying_addresses: [ data.address ],
			fee_paying_addresses: [ changeAddress, firstAddress ],
			change_address: data.address,
			asset: data.asset,
			to_address: changeAddress,
			amount,
			signer: headlessWallet.signer,
			callbacks: {
				ifError: function(err) { sendError(err, 500, res) },
				ifNotEnoughFunds: function(err) { sendError(err, 500, res) },
				ifOk: function(objJoint, arrChains){
					network.broadcastJoint(objJoint);
					//console.error('objJoint: ', objJoint.unit)
					res.status(201);
					res.send( {unit: objJoint.unit.unit } )
				}
			}
		});
	}
	catch (err) { return sendError(err, 500, res) }
})

// ** Move ** //
router.post('/move/', async (req, res) => {
	try {
		const data = req.body
		const valid = await validate(data, 'move', res)
		if (!valid) return false;

		var addresses = await db.query(
			`SELECT address FROM my_addresses
			WHERE address_index <> 0 AND address = ?`, [data.fromAddress]);
		if (!addresses.length) return sendError('Invalid address. fromAddress must be headless wallet address', 400, res)

		let amount = Number(data.amount);
		divisibleAsset.composeAndSaveDivisibleAssetPaymentJoint({
			paying_addresses: [ data.fromAddress ],
			fee_paying_addresses: [ changeAddress, firstAddress ],
			change_address: data.fromAddress,
			asset: data.asset,
			to_address: data.toAddress,
			amount,
			signer: headlessWallet.signer,
			callbacks: {
				ifError: function(err) { sendError(err, 500, res) },
				ifNotEnoughFunds: function(err) { sendError(err, 500, res) },
				ifOk: function(objJoint, arrChains){
					network.broadcastJoint(objJoint);
					//console.error('objJoint: ', objJoint.unit)
					res.status(201);
					res.send( {unit: objJoint.unit.unit } )
				}
			}
		});
	}
	catch (err) { return sendError(err, 500, res) }
})

// ** Burn ** //
router.post('/burn/', async (req, res) => {
	try {
		const data = req.body
		const valid = await validate(data, 'burn', res)
		if (!valid) return false;

		let amount = Number(data.amount);
		divisibleAsset.composeAndSaveDivisibleAssetPaymentJoint({
			paying_addresses: [ changeAddress ],
			fee_paying_addresses: [ changeAddress, firstAddress ],
			change_address: changeAddress,
			asset: data.asset,
			to_address: firstAddress,
			amount,
			signer: headlessWallet.signer,
			callbacks: {
				ifError: function(err) { sendError(err, 500, res) },
				ifNotEnoughFunds: function(err) { sendError(err, 500, res) },
				ifOk: function(objJoint, arrChains){
					network.broadcastJoint(objJoint);
					//console.error('objJoint: ', objJoint.unit)
					res.status(201);
					res.send( {unit: objJoint.unit.unit } )
				}
			}
		});
	}
	catch (err) { return sendError(err, 500, res) }
})

// ** Move Bytes ** //
router.post('/move-bytes/', async (req, res) => {
	try {
		headlessWallet.sendAllBytes(
			conf.payout_address || firstAddress,
			null,
			function(err, unit) {
				if (err) return sendError(err, 500, res)
				res.status(201);
				///res.send( {unit } )
				res.send( {unit: unit} )
			}
		);
	}
	catch (err) { return sendError(err, 500, res) }
})

module.exports = router;
