const express = require('express')
const fileUpload = require('express-fileupload');
const { query } = require('../helpers/db.js')

const cdnRouter = express.Router()

cdnRouter.post("/upload",async(req,res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/files/' + sampleFile.name;
    try {
        const sql = "insert into images (path, uploader_id) values ($1,$2) returning image_id"
        const result = await query(sql,[uploadPath, req.user.id])
        sampleFile.mv(uploadPath, function(err) {
            if (err) return res.status(500).send("Server error");
            res.send('File uploaded!');
        });
        
        
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }
    // Use the mv() method to place the file somewhere on your server
    
})


module.exports = { cdnRouter }