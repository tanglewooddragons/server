const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

const server = new Koa()
const app = new Router()

const port = process.env.PORT || 80

app
  .use(bodyParser())
  .use(logger())

app.get('/test-server/', (ctx) => {
  ctx.body = 'Hello'
  return ctx
})

app.post('/test-server', (ctx) => {
  const data = ctx.request.body
  ctx.body = data
  return ctx
})

app.get('/test-server/data', (ctx) => {
  ctx.body = JSON.stringify({
    answer: 42
  })
  return ctx
})

server
  .use(app.routes())
  .use(app.allowedMethods())

server.listen(port)
