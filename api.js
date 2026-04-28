//express
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { blogRouter } = require('./routes/blog.js')
const { blogPRouter } = require('./routes/blogprotected.js')
const { userRouter } = require('./routes/user.js')
const { cdnPRouter } = require('./routes/cdnprotected.js')

const { authenticateToken } = require('./helpers/auth.js')

//cookies
const cookieParser = require('cookie-parser');

const api = express();

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({extended: false}))
api.use(fileUpload())
api.use(express.static('public'))
api.use(cookieParser())

//Routing
api.use('/user',userRouter) 

api.use('/blog',blogRouter)

api.use(authenticateToken);

api.use('/blog',blogPRouter) 

api.use('/cdn', cdnPRouter)

module.exports = { api }



