//file reading
const fs = require('fs');

//get certificate
const creds = () => {
    try {
        return {
            key: fs.readFileSync(process.env.keyPath),
            cert: fs.readFileSync(process.env.certPath),
        };
    } catch (error){
        return null;
    }
}

module.exports = { creds }