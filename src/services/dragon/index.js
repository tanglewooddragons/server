const Router = require('koa-router')

const createDragon = require('./routes/createDragon')
const getDragon = require('./routes/getDragon')
const updateDragon = require('./routes/updateDragon')
const removeDragon = require('./routes/removeDragon')
const feedDragon = require('./routes/feedDragon')
const getStatuses = require('./routes/getStatuses')
const sendOnTask = require('./routes/sendOnTask')

const { resetFeedStatus } = require('db/dragon')
const { getLocation } = require('db/location')
const { getItem } = require('db/item')

const {
  registerHandler,
  scheduleAction,
} = require('services/scheduler')

const makeResolveTask = require('./resolvers/resolveTask')
const resolveTraining = require('./resolvers/resolveTraining')

const resolveTask = makeResolveTask({
  getLocation,
  getItem,
})

function initSchedules() {
  registerHandler('task', resolveTask)
  registerHandler('training', resolveTraining)
  registerHandler('resetFeed', resetFeedStatus)

  scheduleAction({
    scheduledBy: '[SYSTEM]',
    // Midnight
    scheduledFor: '0 0 * * *',
    type: 'resetFeed',
  })
}


const router = new Router()

router.get('/dragon/statuses', getStatuses)
router.post('/dragon/create', createDragon)
router.post('/dragon/feed/:id', feedDragon)
router.post('/dragon/task', sendOnTask)
router.get('/dragon/:id', getDragon)
router.post('/dragon/:id', updateDragon)
router.delete('/dragon/:id', removeDragon)

module.exports = {
  router,
  initSchedules,
}
