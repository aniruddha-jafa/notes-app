'use strict'

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

let notes = []

<<<<<<< HEAD
router.get('/', (req, res) => {
  res.render('home', { notes: notes, message: "hello world" })
})

router.post('/', async (req, res, next) => {
  const formData = await req.body
  console.log(formData)
  await notes.push(formData)
  console.log(`Note stored! you currently have ${notes.length} notes`)
  res.json({ message: 'submitted' })
  next()
})
=======
router.get('/notes', noteController.notesGet)   // home page

router.get('/api/notes', noteController.notesGetAPI) // READ all notes

router.post('/api/notes', noteController.notesPostAPI)  // CREATE new note


>>>>>>> af98ad6 (edited api end-points)

module.exports = router
