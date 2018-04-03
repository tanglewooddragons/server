const Router = require('koa-router')

const getUser = require('./routes/getUser')
const updateUser = require('./routes/updateUser')
const deleteUser = require('./routes/deleteUser')

const router = new Router()

router.get('/user', getUser)
router.get('/user/:id', getUser)
router.put('/user', updateUser)
router.delete('/user', deleteUser)

module.exports = router
