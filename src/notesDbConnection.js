const mongoose = require('mongoose')
require('dotenv').config()

const connectionOpts = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  poolSize: 10,
}

const notesDbConnection = mongoose.createConnection(
  process.env.MONGODB_NOTES_URI,
  connectionOpts,
)

module.exports = notesDbConnection
