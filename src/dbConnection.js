
const mongoose = require('mongoose')

const opts = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}

exports.connectToNotesDb = function (options=opts) {
    return mongoose.connect(process.env.MONGODB_NOTES_URI, options)
}
