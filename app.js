
'use strict'

// app
const express = require('express')
const app = express()

// config
app.use(express.json())
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
<<<<<<< HEAD
app.use('/notes', notesRouter)
=======
app.use('/', notesRouter)
>>>>>>> af98ad6 (edited api end-points)

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Listening at port ${port}...`)
})
