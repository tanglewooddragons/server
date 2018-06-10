const {
  getUnfiredSchedules,
  markScheduleAsFired,
} = require('db/schedule')
const log = require('util/log')

const scheduleJob = require('./scheduleJob')
const { getHandler } = require('../handlers')

async function restoreSchedules() {
  const schedules = await getUnfiredSchedules()
  log.info(`[Schedule] Restoring ${schedules.length} unfired schedules..`)

  schedules.forEach(async (schedule) => {
    // get resolver for schedule type
    const handler = getHandler(schedule.type)

    // Return if no handler (error)
    if (!handler) {
      log.error(`[Schedule] No handler registered for type: ${schedule.type}`)
      return
    }

    // If schedule is past-due fire it immedietly
    const isDate = Date.parse(schedule.scheduledFor)
    if (isDate && schedule.scheduledFor < Date.now()) {
      await handler(schedule)
      await markScheduleAsFired(schedule.id)
      return
    }

    // set schedule to run
    scheduleJob(schedule)
  })
}

module.exports = restoreSchedules
