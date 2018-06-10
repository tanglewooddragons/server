require('dotenv').load()

const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const bodyparser = require('koa-bodyparser')
const locale = require('koa-locale')
const i18n = require('koa-i18n')
const compress = require('koa-compress')
const cors = require('@koa/cors')
const path = require('path')

const logger = require('util/request-logger')

const app = new Koa()
locale(app)

const jwt = require('./services/auth/middleware/jwt')

const {
  publicAuth,
  privateAuth,
} = require('./services/auth')
const userRouter = require('./services/user').router
const dragonRouter = require('./services/dragon').router
const messageRouter = require('./services/message')

const publicRouter = new Router({
  prefix: '/api',
})

publicRouter.use(publicAuth.routes())
publicRouter.use(publicAuth.allowedMethods())

const privateRouter = new Router({
  prefix: '/api',
})

// Auth
privateRouter.use(privateAuth.routes())
privateRouter.use(privateAuth.allowedMethods())

// User routes
privateRouter.use(userRouter.routes())
privateRouter.use(userRouter.allowedMethods())
privateRouter.use(dragonRouter.routes())
privateRouter.use(dragonRouter.allowedMethods())
privateRouter.use(messageRouter.routes())
privateRouter.use(messageRouter.allowedMethods())

app
  .use(bodyparser())
  .use(compress())
  .use(helmet())
  .use(i18n(app, {
    directory: path.resolve(__dirname, 'constants', 'locales'),
    extension: '.json',
    locales: ['en', 'pl'],
  }))
  .use(cors())
  .use(jwt.unless({
    // Public paths
    // @TODO Merge public and private router now
    // as public paths are stated here.
    path: [
      '/api/register',
      '/api/login',
    ],
  }))
  .use(logger)
  // Public routes
  .use(publicRouter.routes())
  .use(publicRouter.allowedMethods())
  // Private routes (token required)
  .use(privateRouter.routes())
  .use(privateRouter.allowedMethods())

module.exports = app
