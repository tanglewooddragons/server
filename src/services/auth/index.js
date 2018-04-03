const Router = require('koa-router')
const register = require('./actions/register')
const login = require('./actions/login')
const logout = require('./actions/logout')
const logoutAll = require('./actions/logoutAll')

const router = new Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/logoutAll', logoutAll)

module.exports = router
