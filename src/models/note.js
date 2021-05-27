'use strict'

require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const notesDbConnection = mongoose.createConnection(process.env.MONGODB_NOTES_URI)

const NoteSchema = new mongoose.Schema({
  title: {
          type: String,
          maxlength: [ 50,'Title must note exceed 50 characters'],
          trim: true,
          default: 'Untitled'
        },
  date: {
          type: Date,
          required: true,
        },
  body: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
          trim: true
        }
})


module.exports = notesDbConnection.model('Note', NoteSchema)
