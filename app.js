
'use strict'

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello world!')
})


const portToUse = 3000 || 3001
app.listen(portToUse, () => {
  console.log(`Listening at port ${portToUse}...`)
})
