'use strict'

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const noteController = require('../controllers/noteController')

router.get('/notes', noteController.getHome)

router.get('api/notes/:id', noteController.notesReadOne)

router.get('/api/notes', noteController.notesReadMany)

router.post('/api/notes', noteController.notesCreateOne)

module.exports = router
