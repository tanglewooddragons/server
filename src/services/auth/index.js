const Router = require('koa-router')
const register = require('./routes/register')
const login = require('./routes/login')
const refreshToken = require('./routes/refreshToken')
const logout = require('./routes/logout')
const logoutAll = require('./routes/logoutAll')

const publicAuth = new Router()
publicAuth.post('/register', register)
publicAuth.post('/login', login)

const privateAuth = new Router()
privateAuth.post('/refreshToken', refreshToken)
privateAuth.get('/logout', logout)
privateAuth.get('/logoutAll', logoutAll)

module.exports = {
  publicAuth,
  privateAuth,
}
