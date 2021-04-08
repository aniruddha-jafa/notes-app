'use strict'

// libraries
const router = require('express').Router()

const noteController = require('../controllers/noteController')

router.get('/notes', noteController.getHome)

router.get('api/notes/:id', noteController.notesReadOne)

router.get('/api/notes', noteController.notesReadMany)

router.post('/api/notes', noteController.notesCreateOne)

router.put('/api/notes/:id', noteController.notesUpdateOne)

module.exports = router
