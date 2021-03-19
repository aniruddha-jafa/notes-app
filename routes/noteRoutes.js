'use strict'

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

let notes = []

router.get('/', (req, res) => {
  res.render('home', { notes: notes, message: "hello world" })
})

router.post('/create', async (req, res, next) => {
  const formData = await req.body
  console.log(formData)
  await notes.push(formData)
  console.log(`Note stored! you currently have ${notes.length} notes`)
  res.redirect('/')
  next()
})

module.exports = router
