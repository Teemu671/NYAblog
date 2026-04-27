const express = require('express')
const { query } = require('../helpers/db.js')

const blogRouter = express.Router()

blogRouter.post("/post",async(req,res) => {

})
blogRouter.post("/comment/:postID",async(req,res) => {

})
blogRouter.patch("/edit/:postID",async(req,res) => {

})
blogRouter.delete("/delete/:postID",async(req,res) => {

})
blogRouter.get("/all/",async(req,res) => {

})
blogRouter.get("/tag/:tagID",async(req,res) => {

})
blogRouter.get("/id/:postID",async(req,res) => {

})

module.exports = { blogRouter }