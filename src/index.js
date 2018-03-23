const app = require('./app')
const { initWsServer } = require('services/ws')
const log = require('util/log')
const thinky = require('db/thinky')

const { restoreSchedules } = require('services/scheduler')
const initChatService = require('services/chat')

thinky.dbReady().then(() => {
  log.info('Database ready, starting server...')
  app.listen(process.env.APP_PORT, function () {
    const host = this.address().address
    const port = this.address().port
    log.info(`listening at http://${host}:${port}`)
    initChatService()
    initWsServer({ port: process.env.WS_PORT })
    restoreSchedules()
  })
})

process.on('uncaughtException', err => log.error('uncaught exception:', err))
process.on('unhandledRejection', err => log.error('unhandled rejection:', err))
