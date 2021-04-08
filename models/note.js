'use strict'

const { Schema, model, createConnection } = require('mongoose')

require('dotenv').config()

const notesDbConnection = createConnection(
                process.env.MONGODB_NOTES_URI,
                {
                  useNewUrlParser: true,
                  useUnifiedTopology: true
                })

const NoteSchema = new Schema({
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
          type: Schema.Types.Mixed,
          required: true,
          trim: true
        }
})


module.exports = notesDbConnection.model('Note', NoteSchema)
