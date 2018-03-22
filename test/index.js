const server = require('../src/app')
const thinky = require('db/thinky')
const User = require('db/models/user')
const Dragon = require('db/models/dragon')
const Token = require('db/models/token')
const Schedule = require('db/models/schedule')
const ChatMessage = require('db/models/chatMessage')

const register = require('./auth/register')
const login = require('./auth/login')

const getUser = require('./user/getUser')
const updateUser = require('./user/updateUser')
const deleteUser = require('./user/deleteUser')

const createDragon = require('./dragon/createDragon')
const getDragon = require('./dragon/getDragon')
const removeDragon = require('./dragon/removeDragon')
const updateDragon = require('./dragon/updateDragon')
const feedDragon = require('./dragon/feedDragon')

const scheduleAction = require('./scheduler/scheduleAction')

const wsServer = require('./ws/server')

const sendMessage = require('./chat/sendMessage')
const getMessages = require('./chat/getMessages')

before(async () => {
  await thinky.dbReady()
  const users = await User.filter({}).run()
  users.forEach(user => user.delete())

  const dragons = await Dragon.filter({}).run()
  dragons.forEach(dragon => dragon.delete())

  const chatMessages = await ChatMessage.filter({}).run()
  chatMessages.forEach(msg => msg.delete())
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
  })

  describe('#dragon', () => {
    createDragon(app)
    getDragon(app)
    removeDragon(app)
    updateDragon(app)
    feedDragon(app)
  })

  describe('#scheduler', () => {
    scheduleAction()
  })

  describe('#ws', () => {
    wsServer(app)
  })

  describe('#chat', () => {
    sendMessage()
    getMessages()
  })

  app.close()
})

after(async () => {
  // Remove ghost tokens
  const tokens = await Token.filter({}).run()
  tokens.forEach(async t => t.delete())

  // Remove test dragons
  const dragons = await Dragon.filter({}).run()
  dragons.forEach(async dragon => dragon.delete())

  const schedules = await Schedule.filter({}).run()
  schedules.forEach(async s => s.delete())

  // Close connection to db
  thinky.r.getPoolMaster().drain()
})
