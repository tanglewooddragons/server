const Router = require('koa-router')
const register = require('./register')
const login = require('./login')
const logout = require('./logout')

const router = new Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router
