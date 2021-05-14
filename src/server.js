const app = require('./app')
const { connectToNotesDb } = require('./dbConnection')

async function start() {
  try {
    const port = process.env.PORT || 8000
    await connectToNotesDb()
    app.listen(port, () => {
      console.log(`Listening at port ${port}...`)
    })
  } catch (err) {
    console.error(err)
  }
}

start()
