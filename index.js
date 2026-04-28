const cluster = require('node:cluster');
const process = require('node:process');

const { httpsServer } = require('./webapp')
const { api } = require('./api')
const { DBpool } = require('./helpers/db.js')

const APIPort = 3001;
const httpsPort = 443;



api.listen(APIPort);
httpsServer.listen(httpsPort);

 