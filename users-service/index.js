const {
  getUser,
  createUser,
  updateUser,
  getDragonInfo,
  updateDragon,
  getUserDragons,
  loginUser
} = require('./actions')

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

const port = process.env.PORT || 80

router.get('/users/user/:id', getUser)
router.put('/users/user/:id', updateUser)
router.get('/users/dragons', getUserDragons)

router.post('/users/create', createUser)
router.post('/users/login', loginUser)

router.get('/users/dragon/:id', getDragonInfo)
router.put('/users/dragon/:id', updateDragon)

app 
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port)


