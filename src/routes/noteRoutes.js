'use strict'

// libraries
const router = require('express').Router()

const noteController = require('../controllers/noteController')

router.get('/notes', noteController.getHome)

router.route('/api/notes')
  .get(noteController.notesReadMany)
  .post(noteController.notesCreateOne)

router.route('/api/notes/:id')
  .get(noteController.notesReadOne)
  .put(noteController.notesUpdateOne)
  .delete(noteController.notesDeleteOne)

module.exports = router
