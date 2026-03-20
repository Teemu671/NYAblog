const cluster = require('node:cluster');
const process = require('node:process');

const { httpServer, httpsServer } = require('./webapp')
const { api } = require('./api')

const APIPort = 3001;
const httpPort = 80;
const httpsPort = 443;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  
} else {

  api.listen(APIPort);
  httpServer.listen(httpPort);
  httpsServer.listen(httpsPort);

  console.log(`Worker ${process.pid}  started`);
}