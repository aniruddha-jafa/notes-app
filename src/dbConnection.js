const mongoose = require('mongoose')

module.exports = async function dbConnection(test = false) {
  try {
    const opts = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
    if (!test) {
      await mongoose.connect(process.env.MONGODB_NOTES_URI, opts)
      return
    }
    opts.poolSize = 20
    const connection = await mongoose.createConnection(process.env.MONGODB_NOTES_URI, opts)
    return connection
  } catch (err) {
    console.error(err)
  }
}
