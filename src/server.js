const debug = require('debug')('http')

const app = require('./app')
const dbConnection = require('./dbConnection')

async function start() {
  try {
    const port = process.env.PORT || 8000
    await dbConnection()
    app.listen(port, () => {
      debug(`Listening at port ${port}...`)
    })
  } catch (err) {
    debug(err)
  }
}

start()
