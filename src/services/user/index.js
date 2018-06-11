const Router = require('koa-router')
const { getUserById, updateUserById } = require('db/user')

const getUser = require('./routes/getUser')
const updateUser = require('./routes/updateUser')
const deleteUser = require('./routes/deleteUser')

const makeAddToInventory = require('./actions/addToInventory')

const addToInventory = makeAddToInventory({
  getUserById,
  updateUserById,
})

const router = new Router()

router.get('/user', getUser)
router.get('/user/:id', getUser)
router.post('/user', updateUser)
router.delete('/user', deleteUser)

module.exports = {
  router,
  addToInventory,
}
