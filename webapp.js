//express
const express = require('express')

//http / https
const http = require('http');
const https = require('https');

//file reading
const fs = require('fs');

const app = express();


require('dotenv').config({quiet: true})
//get certificate
const creds = {
    key: fs.readFileSync(process.env.keyPath),
    cert: fs.readFileSync(process.env.certPath),
};

app.use(express.json());
app.use(express.urlencoded({extended: false}))
//app.use(cookieParser())

//Routing
app.use('/', express.static(__dirname + '/html'));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(creds,app);

module.exports = { httpServer, httpsServer }