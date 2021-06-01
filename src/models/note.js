'use strict'

require('dotenv').config()

const mongoose = require('mongoose')

const connectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

const notesDbConnection = mongoose.createConnection(
  process.env.MONGODB_NOTES_URI,
  connectionOptions,
)

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [2, 'Title must contain at least 2 characters'],
    maxlength: [50, 'Title must note exceed 50 characters'],
    trim: true,
    default: 'Untitled',
  },
  date: {
    type: Date,
    required: true,
  },
  body: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    trim: true,
  },
})

module.exports = notesDbConnection.model('Note', NoteSchema)
