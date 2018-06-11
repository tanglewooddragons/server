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

const router = new Router()
router.post('/register', register)
router.post('/login', login)
router.post('/refreshToken', refreshToken)
router.post('/logout', logout)
router.get('/logoutAll', logoutAll)
router.get('/acceptToS', acceptToS)

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
  router,
  initSchedules,
}
