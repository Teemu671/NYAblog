//express
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { blogRouter } = require('./routes/blog.js')
const { blogPRouter } = require('./routes/blogprotected.js')
const { cdnRouter } = require('./routes/cdn.js')
const { userRouter } = require('./routes/user.js')
const { cdnPRouter } = require('./routes/cdnprotected.js')

const { authenticateToken } = require('./helpers/auth.js')

//cookies
const cookieParser = require('cookie-parser');

//file reading
const fs = require('fs');
const https = require('https');

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

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(fileUpload())

app.use(cookieParser())

//Routing
app.use('/user',userRouter) 

app.use('/cdn', cdnRouter)

app.use('/blog',blogRouter)

app.use(authenticateToken);

app.use('/blog',blogPRouter) 

app.use('/cdn', cdnPRouter)

const creds = GetCreds();


const api = https.createServer(creds,app);
module.exports = { api }




