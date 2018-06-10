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

const { router: authRouter } = require('./services/auth')
const { router: userRouter } = require('./services/user')
const { router: dragonRouter } = require('./services/dragon')
const messageRouter = require('./services/message')

const router = new Router({
  prefix: '/api',
})

router.use(authRouter.routes())
router.use(authRouter.allowedMethods())
router.use(userRouter.routes())
router.use(userRouter.allowedMethods())
router.use(dragonRouter.routes())
router.use(dragonRouter.allowedMethods())
router.use(messageRouter.routes())
router.use(messageRouter.allowedMethods())

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
    // Public paths (available without token)
    path: [
      '/api/register',
      '/api/login',
    ],
  }))
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
