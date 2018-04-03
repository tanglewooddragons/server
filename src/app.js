require('dotenv').load()

const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const bodyparser = require('koa-bodyparser')
const locale = require('koa-locale')
const i18n = require('koa-i18n')
const compress = require('koa-compress')
const path = require('path')

const app = new Koa()
locale(app)

const jwt = require('./services/auth/middleware/jwt')

const authRouter = require('./services/auth')
const userRouter = require('./services/user')
const dragonRouter = require('./services/dragon').router

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
privateRouter.use(dragonRouter.routes())
privateRouter.use(dragonRouter.allowedMethods())

// Custom auth error handler
app.use((ctx, next) =>
  next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = ctx.i18n.__('AUTHORIZATION_ERROR')
    } else {
      throw err
    }
  })
)

app
  .use(bodyparser())
  .use(compress())
  .use(helmet())
  .use(i18n(app, {
    directory: path.resolve(__dirname, 'constants', 'locales'),
    extension: '.json',
    locales: ['en', 'pl'],
  }))
  // Public routes
  .use(publicRouter.routes())
  .use(publicRouter.allowedMethods())
  .use(jwt)
  // Private routes (token required)
  .use(privateRouter.routes())
  .use(privateRouter.allowedMethods())

module.exports = app
