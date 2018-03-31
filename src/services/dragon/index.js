const Router = require('koa-router')

const createDragon = require('./actions/createDragon')
const getDragon = require('./actions/getDragon')
const updateDragon = require('./actions/updateDragon')
const removeDragon = require('./actions/removeDragon')
const feedDragon = require('./actions/feedDragon')
const getStatuses = require('./actions/getStatuses')

const { resetFeedStatus } = require('db/dragon')

const {
  registerHandler,
  scheduleAction,
} = require('services/scheduler')

const resolveTask = require('./actions/resolveTask')
const resolveTraining = require('./actions/resolveTraining')

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
router.get('/dragon/:id', getDragon)
router.post('/dragon/:id', updateDragon)
router.delete('/dragon/:id', removeDragon)

module.exports = {
  router,
  initSchedules,
}
