'use strict';

// libraries
const jsonParser = require('express').json()

// modules
const Note = require('../models/note')

exports.notesGet = async function (req, res, next) {
  try {
      res.render('home', { notes: [], message: "hello world" })
    } catch(err) {
      next(err)
    }
  }


// READ all notes
let LIMIT = 5, skip = 0
exports.notesGetAPI = async function (req, res, next) {
  try {
    const notes = await Note.find({}).skip(skip).limit(LIMIT)
    res.json(notes)
    skip += LIMIT
    next()

  } catch(err) {
    next(err)
  }

}

// CREATE new note
exports.notesPostAPI = [
  jsonParser,
  async function (req, res, next)  {
   try {
     let formData = await req.body
     formData.body = await JSON.parse(formData.body)
     console.log('formData', formData)

     let note = new Note(formData)
     await note.save()

     res.json({ message: 'submitted' })
     next()
   } catch(err) {
   next(err)
 }
}]
