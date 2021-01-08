
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


// module imports
const homeRouter = require('./routes/homeRoutes')
const notesRouter = require('./routes/noteRoutes')


// view engine & static assets
app.use(express.static(viewsPath))
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')

// routes
app.use('/', homeRouter)
app.use('/api', notesRouter)

const portToUse = process.env.port || 3000

app.listen(portToUse, () => {
  console.log(`Listening at port ${portToUse}...`)
})
