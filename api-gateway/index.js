const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const jwt = require('koa-jwt')
const proxy = require('koa-proxies')

const routes = require('./routes')[process.env.NODE_ENV || 'development']
const { getUserByEmail } =  require('./actions')

const app = new Koa()
const router = new Router()

// Common middleware

app
  .use(helmet())

// Auth routes
//app
//  .use(jwt({ secret: process.env.JWT_SECRET }))


// Proxies
const createProxy = ({ route, target }) => {
  console.log(`Setting proxy for ${route}`)
  app.use(proxy(route, {
    target,
    changeOrigin: true,
    logs: true
  }))
}

routes
  .forEach(createProxy)

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8080)
