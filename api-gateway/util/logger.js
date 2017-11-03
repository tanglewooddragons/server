const bunyan = require('bunyan')

const logger = bunyan.createLogger({
  name: 'tanglewood-api-gateway'
})

module.exports = logger
