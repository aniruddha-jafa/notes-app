'use strict';

// libraries
const jsonParser = require('express').json()

// modules
const Note = require('../models/note')

exports.getHome = async function (req, res, next) {
  try {
      res.render('home')
    } catch(err) {
      next(err)
    }
  }


exports.notesReadOne = async function (req, res, next) {
  try {

    const note = await Note.findById(req.params.id)
    if (!note) {
      throw new Error('Note not found')
    }
    console.log('GET request for note')
    res.json(note)
    next()
  } catch(err) {
    next(err)
  }
}


// READ all notes
let LIMIT = 5, skip = 0
exports.notesReadMany = async function (req, res, next) {
  try {
    const notes = await Note.find({}).skip(skip).limit(LIMIT)
    res.json(notes)
    //skip += LIMIT
    next()

  } catch(err) {
    next(err)
  }

}

exports.notesCreateOne = [
  jsonParser,
  async function (req, res, next)  {
   try {
     let formData = await req.body
     formData.body = await JSON.parse(formData.body)
     console.log('POST request for formData:', formData)
     console.log('note body:', formData.body)

     let note = new Note(formData)
     note = await note.save()

     res.json({ _id: note._id })
     next()
   } catch(err) {
   next(err)
 }
}]


exports.notesUpdateOne = async function(req, res, next) {
  try {

    let formData = await req.body
    formData.body = await JSON.parse(formData.body)

    console.log('PUT request for note:', formData)
    console.log('note body:', formData.body)

    const updatedNote = new Note(formData)

    Note.findByIdAndUpdate(req.params.id, updatedNote)

    res.json({ message: 'updated' })
    next()

  } catch (err) {
    next(err)
  }
}
