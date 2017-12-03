require('dotenv').load()

const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const bodyparser = require('koa-bodyparser')

const app = new Koa()

const auth = require('./services/auth/auth')
const jwt = require('./services/auth/jwt')

const authRouter = require('./services/auth')
const userRouter = require('./services/user')

const publicRouter = new Router({
  prefix: '/api',
})

publicRouter.get('/hello', async (ctx) => {
  ctx.body = 'wrlod'
  return ctx
})

publicRouter.use(authRouter.routes())
publicRouter.use(authRouter.allowedMethods())

const privateRouter = new Router({
  prefix: '/api',
})

privateRouter.get('/secret', async (ctx) => {
  ctx.body = 'admin password'
  return ctx
})

// User routes
privateRouter.use(userRouter.routes())
privateRouter.use(userRouter.allowedMethods())

app
  .use(bodyparser())
  .use(helmet())
  // Public routes
  .use(publicRouter.routes())
  .use(publicRouter.allowedMethods())
  .use(auth)
  .use(jwt)
  // Private routes (token required)
  .use(privateRouter.routes())
  .use(privateRouter.allowedMethods())

module.exports = app
