/*
POST http://localhost:3001/user/register
Content-Type: application/json

{
  "username":"test",
  "email":"test@foo.com",
  "password":"test123"
}
*/


const cluster = require('node:cluster');
const process = require('node:process');
const http = require('http');



if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  
} else {
    console.log(`Worker ${process.pid}  started`);
    setInterval(()=> {
        var str = JSON.stringify({
            "username":"test",
            "email":"test@foo.com",
            "password":"test123"
        })

        var options = {
            host: 'localhost',
            path: '/user/register',
            port: '3001',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Object.keys(str).length
            }
        };

        var req = http.request(options, (res) => {
            res.on('data', (d) => {
                process.stdout.write(d+'\n');
            });
        });
        //This is the data we are posting, it needs to be a string or a buffer
        req.write(str);
        req.end();
    },10)
    
}