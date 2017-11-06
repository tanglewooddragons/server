const connectToRedis = require('./redis').connect
const server = require('./server')
const log = require('./util/logger')

const run = async () => {
  await connectToRedis()

  server.listen(8080, (err) => {
    if (err) log.error(err)

    log.info('Api gateway started')
  })
}

run()
