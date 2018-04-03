const Router = require('koa-router')
const register = require('./routes/register')
const login = require('./routes/login')
const logout = require('./routes/logout')
const logoutAll = require('./routes/logoutAll')

const router = new Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/logoutAll', logoutAll)

module.exports = router
