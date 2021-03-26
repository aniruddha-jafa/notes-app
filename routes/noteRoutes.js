'use strict'

// libraries
const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const Note = require('../models/note')


router.get('', (req, res) => {
  res.render('home', { notes: [], message: "hello world" })
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

module.exports = router
