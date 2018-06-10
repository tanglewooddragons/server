const bunyan = require('bunyan')
const path = require('path')
const fs = require('fs')

const getConsoleLogLevel = () => {
  const env = process.env.NODE_ENV

  if (env === 'test') return 'fatal'
  if (env === 'production') return 'info'
  return 'debug'
}

const getLogDirectory = () =>
  path.resolve(__dirname, '..', '..', 'log')

const logger = bunyan.createLogger({
  name: 'tanglewood-api',
  streams: [
    {
      stream: process.stdout,
      level: getConsoleLogLevel(),
    },
  ],
})

if (process.env.NODE_ENV === 'production') {
  const dir = getLogDirectory()

  /*
    Create log directory on server boot
    if it does not exist, as bunyan will crash
    otherwise
  */
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  logger.addStream({
    type: 'rotating-file',
    path: path.join(dir, 'tanglewood.log'),
    period: '1d',
    count: 14,
  })
}

module.exports = logger
