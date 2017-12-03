const bunyan = require('bunyan')

const logger = (() => {
  if (process.env.NODE_ENV === 'test') {
    return bunyan.createLogger({
      name: 'tanglewood-api',
      level: 'fatal',
    })
  }
  return bunyan.createLogger({
    name: 'tanglewood-api',
  })
})()

module.exports = logger
