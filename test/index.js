const server = require('../src/app')
const thinky = require('../src/db/thinky')
const User = require('../src/db/models/user')
const Dragon = require('../src/db/models/dragon')
const Token = require('../src/db/models/token')

const register = require('./auth/register')
const login = require('./auth/login')

const getUser = require('./user/getUser')
const updateUser = require('./user/updateUser')
const deleteUser = require('./user/deleteUser')
const getUserDragons = require('./user/getUserDragons')

const createDragon = require('./dragon/createDragon')
const getDragon = require('./dragon/getDragon')
const removeDragon = require('./dragon/removeDragon')

before(async () => {
  await thinky.dbReady()
  const users = await User.filter({}).run()
  users.forEach(user => user.delete())

  const dragons = await Dragon.filter({}).run()
  dragons.forEach(dragon => dragon.delete())
})

describe('#tanglewood-api', () => {
  const app = server.listen(3000)

  describe('#auth', () => {
    register(app)
    login(app)
  })

  describe('#user', () => {
    getUser(app)
    updateUser(app)
    deleteUser(app)
    getUserDragons(app)
  })

  describe('#dragon', () => {
    createDragon(app)
    getDragon(app)
    removeDragon(app)
  })

  app.close()
})

after(async () => {
  // Remove ghost tokens
  const tokens = await Token.filter({}).run()
  tokens.forEach(t => t.delete())

  // Remove test dragons
  const dragons = await Dragon.filter({}).run()
  dragons.forEach(dragon => dragon.delete())

  // Close connection to db
  thinky.r.getPoolMaster().drain()
})
