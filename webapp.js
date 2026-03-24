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
const GetCreds = () => {
    try {
        return {
            key: fs.readFileSync(process.env.keyPath),
            cert: fs.readFileSync(process.env.certPath),
        };
    } catch (error){
        return null;
    }
}
const creds = GetCreds();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
//app.use(cookieParser())

//Routing
app.use('/', express.static(__dirname + '/html'));

const httpServer = http.createServer(app);

if (creds != null){
    const httpsServer = https.createServer(creds,app);
    module.exports = { httpServer, httpsServer }
} else {
    module.exports = { httpServer }
}


