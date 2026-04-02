require('dotenv').config({quiet: true})

//express
const express = require('express')

//http / https
const http = require('http');
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
const creds = GetCreds();
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

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

const httpServer = http.createServer(app);

if (creds != null){
    const httpsServer = https.createServer(creds,app);
    module.exports = { httpServer, httpsServer }
} else {
    module.exports = { httpServer }
}


