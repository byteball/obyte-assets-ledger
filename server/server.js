const app = require('./startup/app');

var headlessWallet = require('headless-obyte');
var eventBus = require('ocore/event_bus');
global.firstAddress = global.firstAddress || null;
global.changeAddress = global.firstAddress || null;

// ** headless wallet is ready Event ** //
eventBus.once('headless_wallet_ready', async () => {
  global.firstAddress = global.firstAddress || await headlessWallet.readFirstAddress();
  global.changeAddress = global.changeAddress || await headlessWallet.issueOrSelectStaticChangeAddress();
});

const server = app.listen(process.env.PORT || 8081, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
