'use strict'

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const noteController = require('../controllers/noteController')

router.get('/notes', noteController.notesGet)   // home page

router.get('/api/notes', noteController.notesGetAPI) // READ all notes

router.post('/api/notes', noteController.notesPostAPI)  // CREATE new note



module.exports = router
