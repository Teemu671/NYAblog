const cluster = require('node:cluster');
const process = require('node:process');

const { httpServer, httpsServer } = require('./webapp')
const { api, apiSecure } = require('./api')
const { DBpool } = require('./helpers/db.js')

const APIPort = 3001;
const APISecurePort = 3003;
const httpPort = 80;
const httpsPort = 443;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  cluster.fork();
  cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  // setInterval(()=> {
  //   console.log(DBpool.waitingCount)
  // },1000)
} else {

  //API
  api.listen(APIPort);
  if (apiSecure) {
    apiSecure.listen(APISecurePort);
  }
  //Webapp
  httpServer.listen(httpPort);
  if (httpsServer) {
    httpsServer.listen(httpsPort);
  }
  
  console.log(`Worker ${process.pid}  started`);
}