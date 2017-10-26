const bunyan = require('bunyan')

const logger = bunyan.createLogger({
  name: 'tanglewood-schedule'
})

module.exports = logger

