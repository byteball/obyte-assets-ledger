# Server app for Obyte Assets Ledger

Obyte Headless Wallet with REST JSON API

## Install the dependencies
```bash
yarn install
# or
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
	"payout_address": "", // can be used to withdraw all Bytes or manually consolidate Bytes to 1st address (if empty)
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
	"MAX_UNSPENT_OUTPUTS": 0 // disables Bytes consolidation to change address (default: 100)
}
```

## Start the app
```bash
node server.js
```
and type the passphrase and press ENTER, if prompted.

## Asset metadata registration
All assets need to be issued in their smallest unit amounts. In order to have decimals, you will need to use `10 to a power of decimals` amount of tokens (for example, 10**8 for Bitcoin equivalent). You can register the asset ticker, decimals and description on [Obyte Token Registry](https://tokens.ooo/) (there is [testnet Token Registry](https://testnet.tokens.ooo/) too), so the asset could be proberly shown in Obyte GUI wallet app and Obyte DAG explorers. Read more about [Token Registry on Obyte blog](https://blog.obyte.org/whats-next-for-obyte-decentralized-token-registry-b87d455deeea).

## Asset statistics
Statistic about each token can be queried from [Stats endpoint](https://natalie-seltzer.gitbook.io/obytetokens/totals). Here are their meanings:
* **Tokens in merchant wallet:** `tokensOnChangeAddress`
* **Tokens in clients wallets:** `tokensOnOtherAddresses`
* **Tokens in external wallets:** `tokensOnExternalAddreses`
* **Tokens issued:** `tokensIssued`
* **Tokens burned:** `tokensOnFirstAddress`
* **Total supply:** `tokensIssued-tokensOnFirstAddress`
* **Circulating supply:** `tokensIssued-tokensOnFirstAddress-tokensOnChangeAddress`

Coin listing websites require machine readable Total Supply and Circulating Supply, it is recommended to make these 2 numbers (with correct amount of decimals) available at `DOMAINNAME/total_supply.txt` and `DOMAINNAME/circulating_supply.txt`.

## Documentation
* [Assets Ledger API documenation](https://natalie-seltzer.gitbook.io/obytetokens/)
* [Obyte developer documenation](https://developer.obyte.org/)

## For more info on Obyte dependencies
* [ocore](https://github.com/byteball/ocore/blob/master/README.md)
* [headless-obyte](https://github.com/byteball/headless-obyte/blob/master/README.md)