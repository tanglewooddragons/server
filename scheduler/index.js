const { connect } = require('./db')
const initAmqp = require('./amqp')
const log = require('./util/logger')

const { 
  schedule,
  restoreSchedules
} = require('./schedule')

const start = async () => {
  // Init db
  try {
    log.info('Connecting to db..')
    await connect()  
  } catch (e) {
    // @TODO Implement reconnect logic
    process.exit(1)
  }
  log.info('Connected to db successfully')

  // Init amqp
  const {
    subscribe,
    send,
    close
  } = await initAmqp()

  // Restore all schedules
  log.info('Restoring schedules...')
  await restoreSchedules(send)

  // Subscribe to all schedules
  await subscribe('schedule', async (msg) => {
    log.info('Recieved: ', msg)
    schedule(msg, send)
  })
}

start()
