const debug = require('debug')('http')

const app = require('./app')

async function start() {
  try {
    const port = process.env.PORT || 8000
    app.listen(port, () => {
      debug(`Listening at port ${port}...`)
    })
  } catch (err) {
    debug(err)
  }
}

start()
