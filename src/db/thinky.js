const initThinky = require('thinky')

const config = {
  host: 'localhost',
  port: 28015,
  db: process.env.DB_NAME,
}

const thinky = initThinky(config)

module.exports = thinky
