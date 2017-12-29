const Router = require('koa-router')

const createDragon = require('./actions/createDragon')
const getDragon = require('./actions/getDragon')
const updateDragon = require('./actions/updateDragon')
const removeDragon = require('./actions/removeDragon')

const {
  registerHandler,
} = require('../scheduler/handlers')

const resolveTask = require('./actions/resolveTask')
const resolveTraining = require('./actions/resolveTraining')

registerHandler('task', resolveTask)
registerHandler('training', resolveTraining)

const router = new Router()

router.post('/dragon/create', createDragon)
router.get('/dragon/:id', getDragon)
router.post('/dragon/:id', updateDragon)
router.delete('/dragon/:id', removeDragon)

module.exports = router
