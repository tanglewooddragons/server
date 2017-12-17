require('dotenv').load()

const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const bodyparser = require('koa-bodyparser')

const app = new Koa()

const auth = require('./services/auth/middleware/auth')
const jwt = require('./services/auth/middleware/jwt')

const authRouter = require('./services/auth')
const userRouter = require('./services/user')

const publicRouter = new Router({
  prefix: '/api',
})

publicRouter.use(authRouter.routes())
publicRouter.use(authRouter.allowedMethods())

const privateRouter = new Router({
  prefix: '/api',
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
