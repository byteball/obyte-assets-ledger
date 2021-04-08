const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// routes
const info = require('../routes/info');
const assets = require('../routes/assets');
const addresses = require('../routes/addresses');
const transfer = require('../routes/transfer');
const stats = require('../routes/stats');
const balances = require('../routes/balances');

app.use('/info', info);
app.use('/assets', assets);
app.use('/addresses', addresses);
app.use('/transfer', transfer);
app.use('/stats', stats);
app.use('/balances', balances);

module.exports = app;
