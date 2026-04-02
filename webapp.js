
//express
const express = require('express')

//http / https
const http = require('http');
const https = require('https');


//get certificate
require('dotenv').config({quiet: true});

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

//file reading
const fs = require('fs');
// Path
const path = require('path')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
//app.use(cookieParser())

//Routing
app.use('/', express.static(path.join(__dirname, 'html')))

const httpServer = http.createServer(app);

const creds = GetCreds();

if (creds != null){
    const httpsServer = https.createServer(creds,app);
    module.exports = { httpServer, httpsServer }
} else {
    module.exports = { httpServer }
}


