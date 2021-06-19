const mongoose = require('mongoose')
require('dotenv').config()

const connectionOpts = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  poolSize: 10,
}

if (process.env.NODE_ENV !== 'production') {
  connectionOpts.poolSize = 20
}

const notesDbConnection = mongoose.createConnection(
  process.env.MONGODB_NOTES_URI,
  connectionOpts,
)

module.exports = notesDbConnection
