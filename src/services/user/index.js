const Router = require('koa-router')

const getUser = require('./actions/getUser')
const updateUser = require('./actions/updateUser')
const deleteUser = require('./actions/deleteUser')

const router = new Router()

router.get('/user', getUser)
router.get('/user/:id', getUser)
router.put('/user', updateUser)
router.delete('/user', deleteUser)

module.exports = router
