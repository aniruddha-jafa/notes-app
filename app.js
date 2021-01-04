
'use strict'

const express = require('express')
const app = express()

const path = require('path')
const viewsPath = path.join(__dirname, '/views')
app.use(express.static(viewsPath))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.post('/', (req, res) => {
  console.log('Submission detected, redirecting...')
  res.redirect('/')
})


const portToUse = 3000 || 3001
app.listen(portToUse, () => {
  console.log(`Listening at port ${portToUse}...`)
})
