'use strict'

// libraries
const jsonParser = require('express').json()
const debug = require('debug')('http')

// modules
const notesDbConnection = require('../notesDbConnection')
const noteSchema = require('../models/note')

const Note = notesDbConnection.model('Note', noteSchema)

exports.getHome = async function (req, res, next) {
  try {
    res.render('home', {})
  } catch (err) {
    next(err)
  }
}

exports.notesReadOne = async function (req, res, next) {
  try {
    debug('Received GET request for a single note')
    const note = await Note.findById(req.params.id)
    if (!note) {
      throw new Error('Note not found')
    }
    res.json(note)
    next()
  } catch (err) {
    next(err)
  }
}

const LIMIT = 5
let skip = 0
exports.notesReadMany = async function (req, res, next) {
  try {
    debug('Received GET request for multiple notes')
    const notes = await Note.find({}).skip(skip).limit(LIMIT)
    res.json(notes)
    debug(`Sent ${notes.length} notes`)
    skip += LIMIT
    next()
  } catch (err) {
    next(err)
  }
}

exports.notesCreateOne = [
  jsonParser,
  async function (req, res, next) {
    try {
      const formData = await req.body
      debug('POST request for formData:', formData)
      let note = new Note(formData)
      note = await note.save()
      res.json({ _id: note._id })
      next()
    } catch (err) {
      next(err)
    }
  }]

exports.notesUpdateOne = [
  jsonParser,
  async function (req, res, next) {
    try {
      const formData = await req.body
      debug('PUT request for note:', formData)
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
  async function (req, res, next) {
    try {
      const noteId = await req.params.id
      debug('DELETE request for note:', noteId)
      // await Note.findByIdAndDelete(noteId)
      res.json({ message: 'deleted' })
    } catch (err) {
      next(err)
    }
  },
]
