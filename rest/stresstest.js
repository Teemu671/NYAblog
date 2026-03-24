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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  cluster.fork();
  cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  
} else {
    console.log(`Worker ${process.pid}  started`);
    setInterval(()=> {
        var rand = makeid(8)
        var str = JSON.stringify({
            "username":rand,
            "email":rand+"@gmail.com",
            "password":"test1"
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
    },75)
    
}