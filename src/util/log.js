const bunyan = require('bunyan')

const logLevel = () => {
  const env = process.env.NODE_ENV

  if (env === 'test') return 'fatal'
  if (env === 'production') return 'info'
  return 'debug'
}

const logger = bunyan.createLogger({
  name: 'tanglewood-api',
  level: logLevel(),
})

module.exports = logger
