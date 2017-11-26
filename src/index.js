require('dotenv').load()
const app = require('./app')
const log = require('./util/log')
const thinky = require('./db/thinky')

thinky.dbReady().then(() => {
  log.info('Database ready, starting server...')
  app.listen(8080, function() {
    const host = this.address().address
    const port = this.address().port
    log.info(`listening at http://${host}:${port}`)
  })
})

process.on('uncaughtException', err => log.error('uncaught exception:', err))
process.on('unhandledRejection', err => log.error('unhandled rejection:', err))
