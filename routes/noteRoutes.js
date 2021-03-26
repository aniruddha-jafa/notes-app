'use strict'

// libraries
const router = require('express').Router()

// modules
const noteController = require('../controllers/noteController')

router.get('/notes', noteController.notesGet)

router.post('/notes', noteController.notesPost)

module.exports = router
