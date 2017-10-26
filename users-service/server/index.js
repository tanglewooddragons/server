const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

const port = process.env.PORT || 80

const serve = ({
  getUser,
  updateUser,
  createUser,
}) => {
  router.get('/users/user/:id', getUser)
  router.put('/users/user/:id', updateUser)
  router.post('/users/user/create', createUser)

  app 
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(port)
}

module.exports = serve

