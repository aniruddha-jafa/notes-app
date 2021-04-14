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
    console.log('Received GET request for a single note')
    const note = await Note.findById(req.params.id)
    if (!note) {
      throw new Error('Note not found')
    }
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
    console.log('Received GET request for multiple notes')
    const notes = await Note.find({}).skip(skip).limit(LIMIT)
    res.json(notes)
    console.log(`Sent ${notes.length} notes`)
    skip += LIMIT
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
     let note = new Note(formData)
     note = await note.save()
     res.json({ _id: note._id })
     console.log('POST request for formData:', formData)
     next()
   } catch(err) {
   next(err)
 }
}]


exports.notesUpdateOne = [
  jsonParser,
  async function(req, res, next) {
  try {
    let formData = await req.body
    console.log('PUT request for note:', formData)
    formData.body = await JSON.parse(formData.body)
    await Note.findByIdAndUpdate(req.params.id, formData)
    res.json({ message: 'updated' })
    next()

  } catch (err) {
    next(err)
  }
}]

exports.notesDeleteOne = [
  jsonParser,
  async function(req, res, next) {
  try {
    const noteId = await req.params.id
    console.log('DELETE request for note:', noteId)
    //await Note.findByIdAndDelete(noteId)
    res.json({ message: 'deleted' })
  } catch (err) {
    next(err)
  }
}
]
