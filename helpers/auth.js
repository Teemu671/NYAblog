require('dotenv').config({quiet: true})
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    //Extract token by removing "Bearer " prefix from "Bearer "
    let token = authHeader && authHeader.split(' ')[1];
    
    if(req.cookies.NYAblog){
        token = req.cookies.NYAblog;
    }
    
    if (token == null) return res.status(401).json({message:"Auth failed"});
    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, user) {
    if (err) {
        return res.status(403).json({message:"Auth failed"});
    }
    req.user = user;
    next();
    })
};


module.exports={ authenticateToken }