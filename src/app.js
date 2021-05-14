// libraries
const express = require('express')
const path = require('path')
const ejs = require('ejs')

// app
const app = express()

// module imports
const notesRouter = require('./routes/noteRoutes')

// paths
const viewsPath = path.join(__dirname, '/views')

// config
require('dotenv').config()

app.set('strict routing', true)
app.set('views', viewsPath)

app.use('/api', express.json())

// view engine & static assets
app.set('view engine', 'ejs')
app.use(express.static('public'))

// routes
app.use('/', notesRouter)

// exports
module.exports = app
