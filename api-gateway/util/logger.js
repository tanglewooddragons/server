const bunyan = require('bunyan')

const logger = (() => {
  if (process.env.NODE_ENV === 'test') {
    return bunyan.createLogger({
      name: 'tanglewood-api-gateway',
      level: 'fatal'
    })
  }
  return bunyan.createLogger({
    name: 'tanglewood-api-gateway'
  })
})()

module.exports = logger
