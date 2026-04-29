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

blogRouter.get("/all",async(req,res) => {
    try {
        const sql = "select title, post_id, image_id, parent_id, author_id, text, tag, updated_at from posts where parent_id is null order by post_id desc;"
        const result = await query(sql)
        const rows = result.rows ? result.rows : []
        return res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        return res.status(500).json({error: "Server error"})
    }
})
blogRouter.get("/tag/:tag",async(req,res) => {
    try {
        const sql = "select title, post_id, image_id, parent_id, author_id, text, tag, updated_at from posts where tag like concat($1::text,'%') order by post_id desc;"
        const result = await query(sql,[(req.params.tag).toString()])
        const rows = result.rows ? result.rows : []
        return res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        return res.status(500).json({error: "Server error"})
    }
})
blogRouter.get("/id/:postID",async(req,res) => {
    try {
        const sql = "select title, post_id, image_id, parent_id, author_id, text, tag, updated_at from posts where post_id = $1"
        const result = await query(sql,[req.params.postID])
        return res.status(200).json(result.rows ? result.rows[0] : null)
    } catch (error) {
        res.statusMessage = "Server error"
        return res.status(500).json({error: "Server error"})
    }
})
blogRouter.get("/uid/:uid",async(req,res) => {
    try {
        const sql = "select title, post_id, image_id, parent_id, author_id, text, tag, updated_at from posts where author_id = $1 and parent_id is null order by post_id desc"
        const result = await query(sql,[req.params.uid])
        const rows = result.rows ? result.rows : []
        return res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        return res.status(500).json({error: "Server error"})
    }
})
blogRouter.get("/comments/:postID",async(req,res) => {
    try {
        const sql = "select post_id, image_id, author_id, text, tag, updated_at from posts where parent_id = $1 order by post_id desc;"
        const result = await query(sql,[req.params.postID])
        const rows = result.rows ? result.rows : []
        return res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        return res.status(500).json({error: "Server error"})
    }
})
module.exports = { blogRouter }