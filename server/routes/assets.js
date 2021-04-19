"use strict";
const express = require('express');
const router = express.Router();
var headlessWallet = require('headless-obyte');
var network = require('ocore/network.js');
var composer = require('ocore/composer.js');
const db = require('ocore/db');
const conf = require('ocore/conf');

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
    var assets = await db.query(
      `SELECT a.unit FROM assets AS a, unit_authors AS u
      WHERE u.address = ? AND a.unit = u.unit`,
      [global.firstAddress]);

    var moreAssets = conf.allowedExternalAssets.filter(unit => (unit && unit !== 'base'));
    assets = assets.concat(moreAssets.map(unit => ({unit})));
    assets = assets.filter((v,i,a)=>a.findIndex(t=>(t.unit === v.unit))===i);

    res.send(assets)
  }
  catch (err) { return sendError(err, 500, res) }
});

router.post('/', async (req, res) => {
  try {
    var callbacks = composer.getSavingCallbacks({
      ifError: function(err){ sendError(err, 500, res) },
      ifNotEnoughFunds: function(err){ sendError(err, 500, res) },
      ifOk: function(objJoint){
        network.broadcastJoint(objJoint);
        console.error('==== Asset ID:'+ objJoint.unit.unit);
        res.status(201);
        res.send({ unit: objJoint.unit.unit })
      }
    });

    var asset = {
      is_private: false,
      is_transferrable: true,
      auto_destroy: true,
      fixed_denominations: false,
      issued_by_definer_only: true,
      cosigned_by_definer: false,
      spender_attested: false
    }

    composer.composeAssetDefinitionJoint(firstAddress, asset, headlessWallet.signer, callbacks);
  }
  catch (err) { return sendError(err, 500, res) }
})

module.exports = router;
