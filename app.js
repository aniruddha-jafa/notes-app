
'use strict'

// app
const express = require('express')
const app = express()

// libraries
const path = require('path')
const ejs = require('ejs')

// module imports
const notesRouter = require('./src/routes/noteRoutes')
const { connectToNotesDb } = require('./src/dbConnection')

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

app.listen(port, async () => {
  try {
    await connectToNotesDb()
    console.log(`Listening at port ${port}...`)
  } catch(err) {
    console.error(err)
  }
})
