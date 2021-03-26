
'use strict'

// app
const express = require('express')
const app = express()

// config
require('dotenv').config()

// libraries
const path = require('path')
const hbs = require('hbs')

// paths
const viewsPath = path.join(__dirname, '/views')
const partialsPath = path.join(viewsPath, '/partials')

// module imports
const notesRouter = require('./routes/noteRoutes')

// view engine & static assets
app.use(express.static(viewsPath))
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')

// routes
app.use('/api', notesRouter)

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Listening at port ${port}...`)
})
