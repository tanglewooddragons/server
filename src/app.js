require('dotenv').load()

const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const bodyparser = require('koa-bodyparser')

const app = new Koa()

const auth = require('./services/auth/auth')
const jwt = require('./services/auth/jwt')

const authRouter = require('./services/auth')

const public = new Router({
  prefix: '/api'
})

public.get('/hello', async (ctx) => {
  ctx.body = 'wrlod'
  return ctx
})

public.use(authRouter.routes())
public.use(authRouter.allowedMethods())

const private = new Router({
  prefix: '/api'
})

private.get('/secret', async (ctx) => {
  ctx.body = 'admin password'
  return ctx
})

app
  .use(bodyparser())
  .use(helmet())
  // Public routes
  .use(public.routes())
  .use(public.allowedMethods())
  .use(auth)
  .use(jwt)
  // Private routes (token required)
  .use(private.routes())
  .use(private.allowedMethods())

module.exports = app
