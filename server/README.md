# Server app for Obyte Assets Ledger

Obyte Headless Wallet with REST JSON API

## Install the dependencies
```bash
npm install
```
## Testnet
Run `cp .env.testnet .env` to connect to TESTNET hub. Backup and delete the database if you already ran it on MAINNET. Wallet app for [TESTNET can be downloaded from Obyte.org](https://obyte.org/testnet) website.

## Configuration & data folder
The default configuration are loaded from conf.js files of dependencies ([ocore](https://github.com/byteball/ocore/blob/master/conf.js) and [headless-obyte](https://github.com/byteball/headless-obyte/blob/master/conf.js)), and then override by this project's [conf.js](./conf.js) file. By default, headless wallet will be light node on testnet and full node on mainnet, same with encryption of private keys - no passphrase on testnet, but passphrase on mainnet. This can also be overridden in conf.json file that will be created in data folder (`./config/obyte-assets-ledger/conf.json` on Linux). Here is the example of conf.json (use without commments):
```javascript
{
	"bLight": true, // light node only keeps data related to headless wallet, full node gets all data and is faster
	"hub": "relay.bytes.cash/bb", // peer to connect to (light node: gets data from, full node: finds initial peers from)
	"bNoPassphrase": false, // forces to set private key encryption
	"payout_address": "", // can be used to withdraw all Bytes or manually to consolidate Bytes
	"allowedExternalAssets": [], // array of additional asset IDs to allow to be moves between accounts
	"smtpTransport": "relay", // default is "local" to use sendmail
	"smtpRelay": "smtp.mailtrap.io", // used only when smtpTransport is "relay"
	"smtpUser": "MAILTRAP_INBOX_USER", // used only when smtpTransport is "relay"
	"smtpPassword": "MAILTRAP_INBOX_PASSWORD", // used only when smtpTransport is "relay"
	"smtpSsl": false, // used only when smtpTransport is "relay"
	"smtpPort": 2525, // used only when smtpTransport is "relay"
	"from_email": "test@example.com", // email address to send notification from
	"admin_email": "test@example.com", // email address where to send check_daemon.js notifications
	"socksHost": "127.0.0.1", // TOR proxy address
	"socksPort": 9050, // port for TOR proxy
	"MAX_UNSPENT_OUTPUTS": 0 // disables Bytes consolidation (default: 100)
}
```


## Start the app
```bash
node server.js
```
and type the passphrase and press ENTER, if prompted.

## Documentation 
* [API documenation](https://natalie-seltzer.gitbook.io/obytetokens/)


## For more info on Obyte dependencies
* [ocore](https://github.com/byteball/ocore/blob/master/README.md) 
* [headless-obyte](https://github.com/byteball/headless-obyte/blob/master/README.md) 