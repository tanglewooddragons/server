const server = require('../src/app')
const thinky = require('db/thinky')
const User = require('db/models/user')
const Dragon = require('db/models/dragon')
const Token = require('db/models/token')
const Schedule = require('db/models/schedule')
const ChatMessage = require('db/models/chatMessage')
const LoginInfo = require('db/models/loginInfo')
const UserProfile = require('db/models/userProfile')
const Message = require('db/models/message')

const register = require('./auth/register')
const login = require('./auth/login')
const refreshToken = require('./auth/refreshToken')

const getUser = require('./user/getUser')
const updateUser = require('./user/updateUser')
const deleteUser = require('./user/deleteUser')

const createDragon = require('./dragon/createDragon')
const getDragon = require('./dragon/getDragon')
const removeDragon = require('./dragon/removeDragon')
const updateDragon = require('./dragon/updateDragon')
const feedDragon = require('./dragon/feedDragon')
const getStatuses = require('./dragon/getStatuses')
const sendOnTask = require('./dragon/sendOnTask')

const scheduleAction = require('./scheduler/scheduleAction')

const wsServer = require('./ws/server')

const sendChatMessage = require('./chat/sendMessage')
const getChatMessages = require('./chat/getMessages')

const getMessages = require('./message/getMessages')

jest.useFakeTimers()

beforeAll(async () => {
  await thinky.dbReady()
  const users = await User.filter({}).run()
  users.forEach(user => user.delete())

  const dragons = await Dragon.filter({}).run()
  dragons.forEach(dragon => dragon.delete())

  const chatMessages = await ChatMessage.filter({}).run()
  chatMessages.forEach(msg => msg.delete())

  const schedules = await Schedule.filter({}).run()
  schedules.forEach(s => s.delete())

  const logins = await LoginInfo.filter({}).run()
  logins.forEach(loginInfo => loginInfo.delete())

  const messages = await Message.run()
  messages.forEach(message => message.delete())
})

describe('#tanglewood-api', () => {
  const app = server.listen(3000)

  describe('#auth', () => {
    register(app)
    login(app)
    refreshToken(app)
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
    getStatuses(app)
    sendOnTask(app)
  })

  describe('#scheduler', () => {
    scheduleAction()
  })

  describe('#ws', () => {
    wsServer(app)
  })

  describe('#chat', () => {
    sendChatMessage()
    getChatMessages()
  })

  describe('#message', () => {
    getMessages(app)
  })

  app.close()
})

afterAll(async () => {
  // Remove ghost tokens
  const tokens = await Token.filter({}).run()
  tokens.forEach(t => t.delete())

  // Remove test dragons
  const dragons = await Dragon.filter({}).run()
  dragons.forEach(dragon => dragon.delete())

  const schedules = await Schedule.filter({}).run()
  schedules.forEach(s => s.delete())

  const profiles = await UserProfile.filter({}).run()
  profiles.forEach(profile => profile.delete())

  // Close connection to db
  thinky.r.getPoolMaster().drain()
})
