const server = require('../src/app')
const thinky = require('../src/db/thinky')
const User = require('../src/db/models/user')
const Token = require('../src/db/models/token')

const register = require('./auth/register')
const token = require('./auth/token')

const getUser = require('./user/getUser')
const deleteUser = require('./user/deleteUser')

before(async () => {
  await thinky.dbReady()
  const users = await User.filter({}).run()
  users.forEach(user => user.delete())
})

describe('#tanglewood-api', () => {
  const app = server.listen(3000)

  describe('#auth', () => {
    register(app)
    token(app)
  })

  describe('#user', () => {
    getUser(app)
    deleteUser(app)
  })

  app.close()
})

after(async () => {
  // Remove ghost tokens
  const tokens = await Token.filter({}).run()
  tokens.forEach(t => t.delete())

  // Close connection to db
  thinky.r.getPoolMaster().drain()
})
