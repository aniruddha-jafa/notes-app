

'use strict'

const express = require('express')
const router = express.Router()


router.get('/note/create', (req, res) => {
  res.render('note', {})
})

router.post('/note/create', (req, res) => {
  res.send('to implement: submit note')
})


router.get('/notes', (req, res) => {
  res.send('To implement: list notes')
})




module.exports = router
