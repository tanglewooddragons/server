require('dotenv').load()

process.env.DB_NAME = 'test'

const thinky = require('db/thinky')
const cleanDb = require('./cleanDb')
const prepareDb = require('./prepareDb')

const setup = async () => {
  await thinky.dbReady()
  await cleanDb()
  await prepareDb()
}

module.exports = setup
