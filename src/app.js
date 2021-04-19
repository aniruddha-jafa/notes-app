'use strict'

// app
const express = require('express')
const app = express()

// libraries
const path = require('path')
const ejs = require('ejs')

// module imports
const notesRouter = require('./routes/noteRoutes')
const { connectToNotesDb } = require('./dbConnection')

// paths
const viewsPath = path.join(__dirname, '/views')

// config
require('dotenv').config()
app.set('strict routing', true)
app.set('views', viewsPath)

// view engine & static assets
app.set('view engine', 'ejs')
app.use(express.static('public'))

// routes
app.use('/', notesRouter)

async function start () {
  try {
    const port = process.env.PORT || 8000
    await connectToNotesDb()
    app.listen(port, () => {
        console.log(`Listening at port ${port}...`)
    })
  } catch(err) {
      console.error(err)
  }
}

// exports
exports.start = start
exports.app = app
