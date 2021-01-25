

'use strict'

const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const cors = require('cors')

router.get('/create', (req, res) => {
  res.render('note', {})
})

router.post('/create', (req, res) => {
  console.log(req.body)
  const formData = req.body
  res.send({ message: 'Successful submit!' })
})

const validators = [
  body('title').trim().escape(),
  body('title').not().isEmpty(),
  body('title').isLength({ min: 2 }),
  body('note').trim().escape(),
  body('note').not().isEmpty(),
  body('note').isLength({ min: 3 })
]

router.get('/notes', (req, res) => {
  res.send('To implement: list notes')
})




module.exports = router
