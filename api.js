//express
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { blogRouter } = require('./routes/blog.js')
const { userRouter } = require('./routes/user.js')
//cookies
// const cookieParser = require('cookie-parser');

const api = express();

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({extended: false}))
api.use(fileUpload())
api.use(express.static('public'))

//Routing
api.get('/',(req,res)=>{
    res.send('Welcome to my new Express api!')
})
api.use('/user',userRouter) 

module.exports = { api }



