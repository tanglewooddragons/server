const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const proxy = require('koa-proxies')
const bodyparser = require('koa-bodyparser')

const auth = require('../middleware/auth')
const jwt = require('../middleware/jwt')
const guid = require('../middleware/guid')
const logger = require('../middleware/logger')
const routes = require('../routes')[process.env.NODE_ENV || 'development']
const log = require('../util/logger')

const loginUser = require('../actions/login')
const registerUser = require('../actions/register')

const app = new Koa()
const router = new Router()

// Auth routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Proxies
const createProxy = ({ route, target }) => {
  log.info(`Setting proxy for ${route}`)
  app.use(proxy(route, {
    target,
    changeOrigin: true,
    logs: process.env.NODE_ENV !== 'test'
  }))
}

app
  .use(bodyparser())
  .use(helmet())
  .use(guid)
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())
  .use(auth)
  .use(jwt)

Object
  .values(routes)
  .forEach(createProxy)

module.exports = app
