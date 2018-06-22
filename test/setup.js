require('dotenv').load()

process.env.DB_NAME = 'test'

const thinky = require('db/thinky')
const cleanDb = require('./cleanDb')
const Location = require('db/models/location')

const setup = async () => {
  await thinky.dbReady()
  await cleanDb()

  const testLocation = new Location({
    name: 'Sword Coast',
    goodTerrain: 'Clear sky',
    badTerrain: 'Fog',
    stat: 'wlp',
    hierogliph: 'Twisted Flax',
  })

  await testLocation.save()
}

module.exports = setup
