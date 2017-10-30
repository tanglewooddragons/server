const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const proxy = require('koa-proxies')
const bodyparser = require('koa-bodyparser')

const jwt = require('./middleware/jwt')
const routes = require('./routes')[process.env.NODE_ENV || 'development']

const loginUser = require('./actions/login')
const registerUser = require('./actions/register')

const app = new Koa()
const router = new Router()

// Common middleware
app
  .use(helmet())

// Auth routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Auth middleware
//app
//  .use(jwt)

// Proxies
const createProxy = ({ route, target }) => {
  console.log(`Setting proxy for ${route}`)
  console.log(`Target: ${target}`)
  app.use(proxy(route, {
    target,
    changeOrigin: true,
    logs: true
  }))
}

Object
  .values(routes)
  .forEach(createProxy)

app
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8080)
