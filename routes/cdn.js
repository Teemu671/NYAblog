const express = require('express')
const { query } = require('../helpers/db.js')

const cdnRouter = express.Router()

cdnRouter.get("/image/:imageID", async (req, res) => {
    try {
        const sql = "SELECT filename FROM images WHERE image_id = $1"
        const result = await query(sql, [req.params.imageID])
        if (result.rowCount === 0) return res.status(404).json({ error: "Not found" })
        const rows = result.rows ? result.rows[0] : []
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

module.exports = { cdnRouter }