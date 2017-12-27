const Router = require('koa-router')

const getUser = require('./actions/getUser')
const updateUser = require('./actions/updateUser')
const deleteUser = require('./actions/deleteUser')
const getUserDragons = require('./actions/getUserDragons')

const router = new Router()

router.get('/user', getUser)
router.get('/user/dragons/', getUserDragons)
router.get('/user/dragons/:id', getUserDragons)
router.get('/user/:id', getUser)
router.put('/user', updateUser)
router.delete('/user', deleteUser)

module.exports = router
