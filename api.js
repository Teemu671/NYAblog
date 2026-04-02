//express
const express = require('express')

//http / https
const http = require('http');

const cors = require('cors')
const fileUpload = require('express-fileupload')
const { blogRouter } = require('./routes/blog.js')
const { userRouter } = require('./routes/user.js')
//cookies
// const cookieParser = require('cookie-parser');

const server = express();

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended: false}))
server.use(fileUpload())
server.use(express.static('public'))

//Routing
server.get('/',(req,res)=>{
    res.send('Welcome to my new Express api!')
})
server.use('/user',userRouter) 

const api = http.createServer(server);

module.exports = { api }

