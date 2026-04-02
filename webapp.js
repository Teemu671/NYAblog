//express
const express = require('express')

//http / https
const http = require('http');
const https = require('https');

const server = express();

require('dotenv').config({quiet: true})
// TLS Creds
const { cred } = require('./helpers/creds.js');
const creds = cred()

server.use(express.json());
server.use(express.urlencoded({extended: false}))
//server.use(cookieParser())

//Routing
server.use('/', express.static(__dirname + '/html'));

const httpServer = http.createServer(server);

if (creds != null){
    const httpSecureServer = https.createServer(creds,server);
    module.exports = { httpServer, httpSecureServer }
} else {
    module.exports = { httpServer }
}


