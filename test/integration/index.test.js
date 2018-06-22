const server = require('app')

const register = require('./auth/register')
const login = require('./auth/login')
const refreshToken = require('./auth/refreshToken')
const acceptToS = require('./auth/acceptToS')

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

const wsServer = require('./ws/server')

const getMessages = require('./message/getMessages')
const getSentMessages = require('./message/getSentMessages')
const getReceivedMessages = require('./message/getReceivedMessages')
const sendMessage = require('./message/sendMessage')

describe('#tanglewood-api', () => {
  const app = server.listen(3000)

  describe('#auth', () => {
    register(app)
    login(app)
    refreshToken(app)
    acceptToS(app)
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

  describe('#ws', () => {
    wsServer(app)
  })

  describe('#message', () => {
    getMessages(app)
    getSentMessages(app)
    getReceivedMessages(app)
    sendMessage(app)
  })

  afterAll(() => {
    app.close()
  })
})
