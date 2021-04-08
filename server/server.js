const app = require('./startup/app');

var headlessWallet = require('headless-obyte');
var network = require('ocore/network.js');
var composer = require('ocore/composer.js');
var eventBus = require('ocore/event_bus');

// ** headless wallet is ready Event ** //
eventBus.once('headless_wallet_ready', async () => {
  global.firstAddress = await headlessWallet.readFirstAddress();
  global.changeAddress = await headlessWallet.issueOrSelectStaticChangeAddress();
});

const server = app.listen(process.env.PORT || 8081, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
