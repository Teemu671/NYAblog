const express = require('express')
const fileUpload = require('express-fileupload');
const { query } = require('../helpers/db.js')
const path = require('path')

const cdnPRouter = express.Router()

cdnPRouter.post("/upload",async(req,res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = path.join(__dirname,'..',"temp" );
    //uploadPath = __dirname + '/files/' + sampleFile.name;
    try {
        const sql = "insert into images (path, uploader_id) values ($1,$2) returning image_id"
        const result = await query(sql,[uploadPath, req.user.id])
        uploadPath = path.join(__dirname,'..',"files", `${(req.user.id).toString()}${result.rows[0].image_id}${sampleFile.name}`) ;
        const result2 = await query("update images set path = $1, filename = $2 where image_id = $3",[uploadPath,`${(req.user.id).toString()}${result.rows[0].image_id}${sampleFile.name}`, result.rows[0].image_id])
        sampleFile.mv(uploadPath, function(err) {
            if (err) return res.status(500).json({error: err.message})
            res.status(200).json({message:"file uploaded!", image_id: result.rows[0].image_id})
        });
        
        
    } catch (error) {
        res.statusMessage = error
        res.status(500).json({error: error})
    }
    // Use the mv() method to place the file somewhere on your server
    
})
cdnPRouter.get("/gallery",async(req,res) => {
    try {
        const sql = "select image_id from images where uploader_id = $1 order by image_id"
        const result = await query(sql,[req.user.id])
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
        
        
    } catch (error) {
        res.statusMessage = "Server error"
        res.status(500).json({error: "Server error"})
    }
    
})


module.exports = { cdnPRouter }