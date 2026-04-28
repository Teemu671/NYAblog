const express = require('express')
const fileUpload = require('express-fileupload');
const { query } = require('../helpers/db.js')
const path = require('path')

const cdnRouter = express.Router()

cdnRouter.get("/image/:imageID", async (req, res) => {
    try {
        const sql = "SELECT filename FROM images WHERE image_id = $1"
        const result = await query(sql, [req.params.imageID])
        if (result.rowCount === 0) return res.status(404).json({ error: "Not found" })
        res.sendFile(result.rows[0].filename)
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
})

module.exports = { cdnRouter }