const express = require('express')
const { query } = require('../helpers/db.js')

const blogPRouter = express.Router()

blogPRouter.post("/post",async(req,res) => {
    // req.body.
    //parent_id = null, image_id = from client, author_id from auth, text from client, tag from client
    
})
blogPRouter.post("/comment/:postID",async(req,res) => {
    //parent_id = postID, image_id = null, author_id from auth, text from client, tag inherit from postID
})
blogPRouter.patch("/edit/:postID",async(req,res) => {
    //parent_id = postID, image_id from client, author_id from auth, text from client, tag from client
})
blogPRouter.delete("/delete/:postID",async(req,res) => {
    //parent_id = postID
})

module.exports = { blogPRouter }