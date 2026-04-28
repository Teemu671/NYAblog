const express = require('express')
const { query } = require('../helpers/db.js')

const blogPRouter = express.Router()

blogPRouter.post("/post",async(req,res) => {
    // req.body.
    //req.user.id
    //
    //parent_id = null, image_id = from client, author_id from auth, text from client, tag from client

    try {
        const check = await query("select uploader_id from images where image_id = $1 ",[req.body.image])
        if (check.rowCount === 1 || req.body.image == null) {
            if (req.body.tag.length > 9){
                return res.status(400).json({message: "Tag error"}) 
                
            }
            const sql = "insert into posts (image_id, parent_id, author_id, text, tag) values ($1,$2,$3,$4,$5) returning post_id"
            const result = await query(sql,[req.body.image,null,req.user.id,req.body.message,req.body.tag])
            return res.status(200).json({message: "Successfully posted"}) 
        } else {
            return res.status(400).json({message: "Image error"}) 
        }
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }

})
blogPRouter.post("/comment/:postID",async(req,res) => {
    //parent_id = postID, image_id = null, author_id from auth, text from client, tag inherit from postID
    try {
        const check = await query("select uploader_id from images where image_id = $1",[req.body.image])
        if (check.rowCount === 1 || req.body.image == null) {
            const check2 = await query("select tag from posts where post_id = $1",[req.params.postID])
            const sql = "insert into posts (image_id, parent_id, author_id, text, tag) values ($1,$2,$3,$4,$5) returning post_id"
            const result = await query(sql,[req.body.image,req.params.postID,req.user.id,req.body.message,check2.row[0]])
            return res.status(200).json({message: "Successfully posted"}) 
        } else {
            return res.status(400).json({message: "Image error"}) 
        }
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }
})
blogPRouter.patch("/edit/:postID",async(req,res) => {
    //parent_id = postID, image_id from client, author_id from auth, text from client, tag from client
    
})
blogPRouter.delete("/delete/:postID",async(req,res) => {
    //parent_id = postID
})

module.exports = { blogPRouter }