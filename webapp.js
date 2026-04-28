require('dotenv').config({quiet: true})

//express
const express = require('express')

//http / https
const https = require('https');


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

//file reading
const fs = require('fs');
// Path
const path = require('path')

const app = express();




app.use(express.json());
app.use(express.urlencoded({extended: false}))
//app.use(cookieParser())

//Routing
app.use('/',express.static('html',{extensions:['html']}));
app.use('/cdn',express.static('files'));

const creds = GetCreds();

const httpsServer = https.createServer(creds,app);
module.exports = {  httpsServer }



