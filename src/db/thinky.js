const initThinky = require('thinky')

const config = {
  host: 'localhost',
  port: 28015,
  db: process.env.DB_DATABASE,
  user: 'admin',
  password: process.env.DB_PASSWORD,
}

const thinky = initThinky(config)

module.exports = thinky
