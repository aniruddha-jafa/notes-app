
'use strict'

// app
const express = require('express')
const app = express()

// libraries
const path = require('path')
const hbs = require('hbs')

// module imports
const notesRouter = require('./routes/noteRoutes')

// paths
const viewsPath = path.join(__dirname, '/views')
const partialsPath = path.join(viewsPath, '/partials')

// config
require('dotenv').config()
app.set('view engine', 'hbs')
app.set('strict routing', true)

// view engine & static assets
app.use(express.static(viewsPath))
hbs.registerPartials(partialsPath)

// routes
app.use('/', notesRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Listening at port ${port}...`)
})
