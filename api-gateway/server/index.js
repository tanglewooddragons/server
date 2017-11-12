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
const deleteUser = require('../actions/delete')

const app = new Koa()
const public = new Router()
const private = new Router()

// Auth routes
public.post('/register', registerUser)
public.post('/login', loginUser)

// Private links (require auth)
private.delete('/delete/:id', deleteUser)

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
  .use(async (ctx, next) => {
    // Attach user to every proxied request
    ctx.body = {
      ...ctx.body,
      user: ctx.state.user
    }
    await next()
  })

Object
  .values(routes)
  .forEach(createProxy)

module.exports = app
