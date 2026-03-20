require('dotenv').config({quiet: true})
const { Pool } = require('pg')

const pool = new Pool ({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})
const query = (sql,values=[]) => {
  return new Promise(async(resolve,reject)=> {
    try {
      
      const client = await pool.connect()
      const result = await client.query(sql,values)
      client.release()
      resolve(result)
    } catch (error) {
      reject(error.message)
    }
  })
}



module.exports = {
  query
}