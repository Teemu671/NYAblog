const express = require('express')
const { query } = require('../helpers/db.js')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
require('dotenv').config({quiet: true})

const userRouter = express.Router()

userRouter.post("/login",async(req,res) => {
  try {
    if (req.body.email) {
        const sql = "select * from users where email=$1"
        const result = await query(sql,[req.body.email])
        if (result.rowCount === 1) {
            try {
            const userRole = result.rows[0].role;
            const userID = result.rows[0].user_id;
            const userName = result.rows[0].username;
            if (await argon2.verify(result.rows[0].password,req.body.password)) {
                const token = jwt.generateAccessToken(userName, userID, userRole)

                    const user = result.rows[0]
                    res.clearCookie(`NYAblog`)
                    res.cookie(`NYAblog`,`${token}`)
                    res.status(200).json(
                    {
                        message: "Login successful",
                        "token":token
                    }
                    )
            } else {
                res.statusMessage = 'Invalid login'
                res.status(401).json({error: 'Invalid login'})
            }
            } catch (err) {
            console.log(err)
            res.statusMessage = 'Server Error'
            res.status(500).json({error: 'Server Error'})
            }
        } else {
        res.statusMessage = 'Invalid login'
        res.status(401).json({error: 'Invalid login'})
        }
    } else {
      res.statusMessage = 'Bad request'
      res.status(400).json({error: 'Invalid request'})
    }
    } catch (error) {
        res.statusMessage = 'Bad request'
        res.status(400).json({error: 'Invalid request'})
    }
    
})

function generateAccessToken(uname, id, role) {
  return jwt.sign({ uname, id, role }, process.env.SECRET_TOKEN,{ expiresIn: '7200s' });
}

const unameReg = /^(?=^.{3,16}$)[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/
const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const pswReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

userRouter.post("/register",async(req,res) => {
      if (req.body.password && req.body.username && req.body.email) {
        const uname = req.body.username;
        const psw = req.body.password;
        const email = req.body.email;
        if (unameReg.test(uname)){
          if (emailReg.test(email)){
            if (pswReg.test(psw)){

              const sql = "select count(*) as count from users where email = $1 or username = $2"
              const result = await query(sql,[req.body.email,req.body.username])
              if (result.rows[0].count<1){
                try {
                  const hash = await argon2.hash(req.body.password);
                  const sql = "insert into users (username, display_name, email, password, role) values ($1,$1,$2,$3,$4) returning user_id"
                  const result = await query(sql,[req.body.username,req.body.email,hash,'user'])
                  res.status(200).json({message: "Successfully account created"}) 
                } catch (error) {
                  res.statusMessage = "Server error"
                  res.status(500).json({error: "Server error"})
                }
              } else {
                res.statusMessage = 'Invalid register'
                res.status(401).json({error: 'User exists'})
              }
            } else {
              res.statusMessage = 'Invalid register'
              res.status(401).json({error: 'Invalid password'})
            }
          } else {
            res.statusMessage = 'Invalid register'
            res.status(401).json({error: 'Invalid email'})
          }
        } else {
          res.statusMessage = 'Invalid register'
          res.status(401).json({error: 'Invalid username'})
        }
      } else {
        res.statusMessage = 'Bad request'
        res.status(400).json({error: 'Invalid login'})
      }
})



module.exports = { userRouter }