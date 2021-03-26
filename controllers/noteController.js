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


exports.notesPost = [
  jsonParser,
  async function (req, res, next)  {
   try {
     let formData = await req.body
     formData.body = await JSON.parse(formData.body)

     let note = new Note(formData)
     await note.save()

     res.json({ message: 'submitted' })
     next()
   } catch(err) {
   next(err)
 }
}]
