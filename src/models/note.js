require('dotenv').config()

const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
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

// module.exports = mongoose.model('Note', NoteSchema)
module.exports = NoteSchema
