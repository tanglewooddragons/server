const { createUser } = require('db/user')
const Location = require('db/models/location')
const hashPassword = require('util/hash')

const createTestLocation = async () => {
  const testLocation = new Location({
    name: 'Sword Coast',
    goodTerrain: 'Clear sky',
    badTerrain: 'Fog',
    stat: 'wlp',
    hierogliph: 'Twisted Flax',
  })

  await testLocation.save()
}

const createTestUser = async () => {
  const password = await hashPassword('test')

  const user = {
    username: 'tester',
    email: 'test@test.com',
    password,
  }

  return createUser(user)
}

const prepareDb = async () => {
  await createTestLocation()
  await createTestUser()
}

module.exports = prepareDb
