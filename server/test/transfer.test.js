const test = require('ava');
process.env.testnet = 1;
global.firstAddress = 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N';
global.changeAddress = 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H';

var desktop_app = require('ocore/desktop_app.js');
desktop_app.getAppDataDir = function () { return __dirname + '/temp'; }

let transfer; // lazy load

test.before('check testnet', (t) => {
  if (!process.env.testnet) {
    return t.fail('testnet is missing');
  }
  transfer = require('../routes/transfer'); // lazy load
  t.pass('testnet is set');
});

test('transfer validate invalid data', async (t) => {
  t.false(await transfer.validate());
  t.false(await transfer.validate({}));
  t.false(await transfer.validate({asset:'x'}));
  t.false(await transfer.validate({asset:'x', amount: 1}));
  t.false(await transfer.validate({amount: 1}));
  t.false(await transfer.validate({asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o='}));
  t.false(await transfer.validate({asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=', amount: 1}));
  t.false(await transfer.validate({asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=', amount: 0}));
  t.false(await transfer.validate({asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=', amount: -1}));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
    }, 'x'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'x'));
});

test('transfer validate buy fail', async (t) => {
  t.false(await transfer.validate({}, 'buy'));
  t.false(await transfer.validate({asset:'x'}, 'buy'));
  t.false(await transfer.validate({amount: 1}, 'buy'));
  t.false(await transfer.validate({asset:'x', amount: 1}, 'buy'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
    }, 'buy'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: 'x',
    }, 'buy'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 0,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'buy'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: -1,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'buy'));
});

test('transfer validate buy success', async (t) => {
  t.true(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'buy'));
});

test('transfer validate buy first address', async (t) => {
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N',
    }, 'buy'));
});

test('transfer validate buy change address', async (t) => {
  t.true(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H',
    }, 'buy'));
});

test('transfer validate sell fail', async (t) => {
  t.false(await transfer.validate({}, 'sell'));
  t.false(await transfer.validate({asset:'x'}, 'sell'));
  t.false(await transfer.validate({amount: 1}, 'sell'));
  t.false(await transfer.validate({asset:'x', amount: 1}, 'sell'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
    }, 'sell'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: 'x',
    }, 'sell'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 0,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'sell'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: -1,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'sell'));
});

test('transfer validate sell success', async (t) => {
  t.true(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'sell'));
});

test('transfer validate sell first address', async (t) => {
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N',
    }, 'sell'));
});

test('transfer validate sell change address', async (t) => {
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H',
    }, 'sell'));
});

test('transfer validate move fail', async (t) => {
  t.false(await transfer.validate({}, 'move'));
  t.false(await transfer.validate({
      asset:'x',
      amount: 1,
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      address: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      toAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 0,
      fromAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
      toAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: -1,
      fromAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
      toAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
});

test('transfer validate move first address and change address', async (t) => {
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N',
      toAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H',
      toAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
      toAddress: 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
      toAddress: 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N',
      toAddress: 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H',
    }, 'move'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: 'E2U77O5AO5UPNSKKQEDKFGKNYWQ5467H',
      toAddress: 'F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N',
    }, 'move'));
});

test('transfer validate move success', async (t) => {
  t.true(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
      fromAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
      toAddress: '5ZPGXCOGRGUUXIUU72JIENHXU6XU77BD',
    }, 'move'));
});

test('transfer validate burn fail', async (t) => {
  t.false(await transfer.validate({}, 'burn'));
  t.false(await transfer.validate({
      asset:'x',
      amount: 1,
    }, 'burn'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 0,
    }, 'burn'));
  t.false(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: -1,
    }, 'burn'));
});

test('transfer validate burn success', async (t) => {
  t.true(await transfer.validate({
      asset:'IYzTSjJg4I3hvUaRXrihRm9+mSEShenPK8l8uKUOD3o=',
      amount: 1,
    }, 'burn'));
});
