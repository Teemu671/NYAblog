require('dotenv').config({quiet: true})
const { Pool } = require('pg')

const DBpool = new Pool ({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})
const query = (sql,values=[]) => {
  return new Promise(async(resolve,reject)=> {
    const client = await DBpool.connect()
    try {
      const result = await client.query(sql,values)
      client.release()
      resolve(result)
    } catch (error) {
      if (client) client.release()
      reject(error.message)
    }
  })
}



module.exports = {
  DBpool, query
}