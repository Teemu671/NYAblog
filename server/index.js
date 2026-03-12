const express = require('express')
const { Pool } = require('pg')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))

const httpPort = 80;
const httpsPort = 443;

// const openDb = () => {
//     const pool = new Pool ({
//         user: 'postgres',
//         host: 'localhost',
//         database: 'todo',
//         password: 'root',
//         port: 5432
//     })
//     return pool;
// }

app.get("/",(req,res)=>{
    //needs routes
})