// libraries
const express = require('express')
const path = require('path')
// const ejs = require('ejs')

// app
const app = express()

// module imports
const notesRouter = require('./routes/noteRoutes')

// paths
const viewsPath = path.join(__dirname, 'views')
const quilljsPath = path.join('node_modules', 'quill', 'dist')
const bootstrapPath = path.join('node_modules', 'bootstrap', 'dist')
const featherIconsPath = path.join('node_modules', 'feather-icons', 'dist')

// config
require('dotenv').config()

app.set('strict routing', true)
app.set('views', viewsPath)

app.use('/api', express.json())

// view engine
app.set('view engine', 'ejs')

// static assets
app.use(express.static('public'))
app.use('/vendor-assets/quill', express.static(quilljsPath))
app.use('/vendor-assets/bootstrap', express.static(bootstrapPath))
app.use('/vendor-assets/feather-icons', express.static(featherIconsPath))

// routes
app.use('/', notesRouter)

// exports
module.exports = app
