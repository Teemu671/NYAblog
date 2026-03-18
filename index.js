
//express
const express = require('express')

//http / https
const http = require('http');
const https = require('https');

const httpPort = 80;
const httpsPort = 443;
//file reading
const fs = require('fs');

//cookies
// const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
// app.use(cookieParser())

app.use('/', express.static(__dirname + '/html'));

//app.use("/", )

//get certificate
// const creds = {
//     key: fs.readFileSync(''),
//     cert: fs.readFileSync(''),
// };


const httpServer = http.createServer(app);
//const httpsServer = https.createServer(creds,app);

httpServer.listen(httpPort, () => {
  console.log(`server running at http://localhost:${httpPort}`);
});

// httpsServer.listen(httpsPort, () => {
//   console.log(`server running at http://localhost:${httpsPort}`);
// });