const server = require('./server')
const log = require('./util/logger')

server.listen(8080, (err) => {
  if (err) log.error(err)

  log.info('Api gateway started')
})
