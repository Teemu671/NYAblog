const express = require('express')
const { query } = require('../helpers/db.js')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('../helpers/auth.js');
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
                const token = generateAccessToken(userName, userID, userRole)

                    const user = result.rows[0]
                    res.clearCookie(`NYAblog`)
                    res.cookie(`NYAblog`,`${token}`)
                    res.status(200).json(
                    {
                        message: "Login successful",
                        token: token,
                        id: userID,
                        email: result.rows[0].email
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
  return jwt.sign({ uname, id, role }, process.env.JWT_SECRET_KEY,{ expiresIn: '7200s' });
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
                  return res.status(200).json({message: "Successfully account created"}) 
                } catch (error) {
                  res.statusMessage = "Server error"
                  return res.status(500).json({error: "Server error"})
                }
              } else {
                res.statusMessage = 'There is an account already with your username or email.'
                return res.status(401).json({error: 'User exists'})
              }
            } else {
              res.statusMessage = 'Password must be at least 8 characters have 1 upper, 1 lower, 1 special, 1 number character.'
              return res.status(401).json({error: 'Invalid password'})
            }
          } else {
            res.statusMessage = 'Give a possible email.'
            return res.status(401).json({error: 'Invalid email'})
          }
        } else {
          res.statusMessage = 'Username must be 3 to 16 characters.'
          return res.status(401).json({error: 'Invalid username'})
        }
      } else {
        res.statusMessage = 'Bad request'
        return res.status(400).json({error: 'Invalid login'})
      }
})

userRouter.get("/uid/:uid",async(req,res) => {
  // display_name, username, role, avatar_id
    try {
        const sql = "select display_name, username, role, avatar_id from users where user_id = $1;"
        const result = await query(sql, [req.params.uid])
        const rows = result.rows ? result.rows[0] : []
        return res.status(200).json(rows)
    } catch (error) {
        res.statusMessage = "Server error"
        return res.status(500).json({error: "Server error"})
    }
})

userRouter.patch("/avatar", authenticateToken, async (req, res) => {
  try {
    const { image_id } = req.body;

    const check = await query(
      "SELECT uploader_id FROM images WHERE image_id = $1",
      [image_id]
    );
    if (check.rowCount === 0 || check.rows[0].uploader_id !== req.user.id) {
      return res.status(403).json({ error: "Image not yours" });
    }
    await query(
      "UPDATE users SET avatar_id = $1 WHERE user_id = $2",
      [image_id, req.user.id]
    );
    return res.status(200).json({ message: "Avatar updated" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = { userRouter }