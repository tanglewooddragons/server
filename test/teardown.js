require('dotenv').load()

process.env.DB_NAME = 'test'

const thinky = require('db/thinky')
const cleanDb = require('./cleanDb')

const teardown = async () => {
  await cleanDb()

  // Close connection to db
  thinky.r.getPoolMaster().drain()
}

module.exports = teardown
