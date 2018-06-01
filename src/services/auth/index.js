const Router = require('koa-router')

const register = require('./routes/register')
const login = require('./routes/login')
const refreshToken = require('./routes/refreshToken')
const logout = require('./routes/logout')
const logoutAll = require('./routes/logoutAll')
const acceptToS = require('./routes/acceptToS')

const { removeExpiredTokens } = require('db/token')
const {
  registerHandler,
  scheduleAction,
} = require('services/scheduler')

const publicAuth = new Router()
publicAuth.post('/register', register)
publicAuth.post('/login', login)

const privateAuth = new Router()
privateAuth.post('/refreshToken', refreshToken)
privateAuth.get('/logout', logout)
privateAuth.get('/logoutAll', logoutAll)
privateAuth.get('/acceptToS', acceptToS)

function initSchedules() {
  removeExpiredTokens()

  registerHandler('removeExpiredTokens', removeExpiredTokens)
  scheduleAction({
    scheduledBy: '[SYSTEM]',
    // Every 20 minutes
    scheduledFor: '*/20 * * * *',
    type: 'removeExpiredTokens',
  })
}

module.exports = {
  publicAuth,
  privateAuth,
  initSchedules,
}
