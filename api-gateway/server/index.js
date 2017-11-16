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

// Public links
const loginUser = require('../actions/login')
const registerUser = require('../actions/register')
const logoutUser = require('../actions/logout')
const deleteUser = require('../actions/delete')

const app = new Koa()
const public = new Router()
const private = new Router()

// Public routes
public.post('/register', registerUser)
public.post('/login', loginUser)

// Private routes (require auth)
private.delete('/delete', deleteUser)
private.get('/logout', logoutUser)

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
  .use(public.routes())
  .use(public.allowedMethods())
  .use(auth)
  .use(jwt)
  .use(private.routes())
  .use(private.allowedMethods())
  
Object
  .values(routes)
  .forEach(createProxy)

app
  .use(async (ctx, next) => {
    // Attach user to every proxied request
    ctx.body = Object.assign({}, ctx.body, { user: ctx.state.user })
    await next()
  })


module.exports = app
