
'use strict'

const express = require('express')
const app = express()

const path = require('path')
const viewsPath = path.join(__dirname, '/views')
const partialsPath = path.join(viewsPath, '/partials')

app.use(express.static(viewsPath))

const hbs = require('hbs')
hbs.registerPartials(partialsPath)

app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('home', {})
})

app.get('/create', (req, res) => {
  res.render('create-note', {})
})

const portToUse = 3000 || 3001
app.listen(portToUse, () => {
  console.log(`Listening at port ${portToUse}...`)
})
