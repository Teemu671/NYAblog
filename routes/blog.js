const express = require('express')
const { query } = require('../helpers/db.js')

const blogRouter = express.Router()
/*create table "posts" (
    "post_id" serial primary key,
    "parent_id" int,
    "author_id" int,
    "text" varchar(255) not null,
    "tag" varchar(16),
    "created_at" timestamp not null default NOW(),
    "updated_at" timestamp not null default NOW(),
    CONSTRAINT fk_users FOREIGN KEY (author_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (parent_id)
    REFERENCES posts(post_id)
    ON DELETE CASCADE
);*/

blogRouter.get("/all/:skip",async(req,res) => {
    try {
        const skip = Number(req.params.skip);
        const sql = "select post_id, image_id, parent_id, author_id, text, tag, updated_at from posts order by post_id desc limit 5 offset $1;"
        const result = await query(sql, [skip])
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }
})
blogRouter.get("/tag/:tag/:skip",async(req,res) => {
    try {
        const skip = Number(req.params.skip);
        const sql = "select post_id, image_id, parent_id, author_id, text, tag, updated_at from posts where tag like concat($1,'%') order by post_id desc limit 5 offset $2;"
        const result = await query(sql,[(req.params.tag).toString(),skip])
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }
})
blogRouter.get("/id/:postID/:skip",async(req,res) => {
    try {
        const skip = Number(req.params.skip);
        const sql = "select post_id, image_id, parent_id, author_id, text, tag, updated_at from posts where post_id like concat($1,'%') order by post_id desc limit 5 offset $2;"
        const result = await query(sql,[req.params.postID,skip])
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }
})


module.exports = { blogRouter }