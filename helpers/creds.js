require('dotenv').config({quiet: true})

//file reading
const fs = require('fs');

//get certificate
const cred = () => {
    try {
        return {
            key: fs.readFileSync(process.env.keyPath),
            cert: fs.readFileSync(process.env.certPath),
        };
    } catch (error){
        return null;
    }
}

module.exports = { cred }