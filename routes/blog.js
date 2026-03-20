const express = require('express')
const { query } = require('../helpers/db.js')

const blogRouter = express.Router()

module.exports = { blogRouter }