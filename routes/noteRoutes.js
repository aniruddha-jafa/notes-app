'use strict'

// libraries
const router = require('express').Router()

// modules
const noteController = require('../controllers/noteController')

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
router.get('/', (req, res) => {
  res.render('home', { notes: notes, message: "hello world" })
=======

router.get('', (req, res) => {
  res.render('home', { notes: [], message: "hello world" })
>>>>>>> 19e07f4 (Persisted note data on back-end (mongodb))
})


router.post('', async (req, res, next) => {
  try {
    const formData = await req.body
    //console.log('formData', typeof(formData), formData)

    formData.body = await JSON.parse(formData.body)
    //console.log('formData.body', typeof(formData.body), formData.body)

    let note = new Note(formData)
    //console.log('note', note)
    //console.log('note-body', note.body.ops)

    note.save(err => {
      if (err) { return next(err) }
    })
    res.json({ message: 'submitted' })
    next()
  } catch(err) {
    console.error(err)
  }
})
=======
router.get('/notes', noteController.notesGet)   // home page

router.get('/api/notes', noteController.notesGetAPI) // READ all notes

router.post('/api/notes', noteController.notesPostAPI)  // CREATE new note


>>>>>>> af98ad6 (edited api end-points)
=======
router.get('/notes', noteController.notesGet)

router.post('/notes', noteController.notesPost)
>>>>>>> 8594c34 (Moved route-handlers to /controllers)

module.exports = router
