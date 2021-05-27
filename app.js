
'use strict'

// app
const express = require('express')
const app = express()

// libraries
const path = require('path')
const hbs = require('hbs')

// paths
const viewsPath = path.join(__dirname, '/views')
const partialsPath = path.join(viewsPath, '/partials')
const scriptsPath = path.join(viewsPath, '/scripts')

// module imports
const notesRouter = require('./src/routes/noteRoutes')

// paths
const viewsPath = path.join(__dirname, '/src/views')

// config
require('dotenv').config()
app.set('strict routing', true)
app.set('views', viewsPath)

// view engine & static assets
app.set('view engine', 'ejs')
app.use(express.static('public'))

// routes
app.use('/', notesRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Listening at port ${port}...`)
})
