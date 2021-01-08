

'use strict'

const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')


router.get('/note/create', (req, res) => {
  res.render('note', {})
})

router.post('/note/create',
  body('title').trim().escape(),
  body('title').not().isEmpty(),
  body('title').isLength({ min: 2 }),
  body('note').trim().escape(),
  body('note').not().isEmpty(),
  body('note').isLength({ min: 3 }),
(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  res.send('Successful submit!')
})


router.get('/notes', (req, res) => {
  res.send('To implement: list notes')
})




module.exports = router
