const initThinky = require('thinky')

const config = {
  host: 'localhost',
  port: 28015,
  db: 'tanglewood',
}

const thinky = initThinky(config)

module.exports = thinky
