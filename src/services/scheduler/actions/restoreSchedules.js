const scheduleJob = require('./scheduleJob')

const {
  getUnfiredSchedules,
  markScheduleAsFired,
} = require('../../../db/schedule')
const {
  getHandler,
} = require('../handlers')
const log = require('../../../util/log')

async function restoreSchedules() {
  const schedules = await getUnfiredSchedules()

  schedules.forEach(async (schedule) => {
    // get resolver for schedule type
    const handler = getHandler(schedule.type)

    // Return if no handler (error)
    if (!handler) {
      log.error(`No handler registered for type: ${schedule.type}`)
      return
    }

    // If schedule is past-due fire it immedietly
    if (schedule.scheduledFor < Date.now()) {
      await handler(schedule)
      await markScheduleAsFired(schedule.id)
      return
    }

    // set schedule to run
    scheduleJob(schedule)
  })
}

module.exports = restoreSchedules
