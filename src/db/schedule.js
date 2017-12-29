const Schedule = require('./models/schedule')
const log = require('../util/log')

async function getUnfiredSchedules() {
  try {
    log.debug('Fetching unfired schedules..')
    const schedules = await Schedule.filter({
      fired: false,
    }).run()
    log.debug(`Got ${schedules.length} unfired schedules`)
    return schedules
  } catch (err) {
    log.error(`Error getting unfired schedules: ${err}`)
    return null
  }
}
async function setSchedule(options) {
  try {
    log.debug(options, 'Setting new schedule..')
    const schedule = new Schedule(options)
    await schedule.save()
    log.debug(schedule, 'Schedule set up successfully')
    return schedule
  } catch (err) {
    log.error(`Error setting schedule: ${err}`)
    return null
  }
}
async function cancelSchedule(id) {
  try {
    log.debug(`Deleting schedule ${id}`)
    const schedule = await Schedule.get(id).run()
    await schedule.delete()
    log.debug(`Deleted schedule ${id} successfully`)
    return true
  } catch (err) {
    log.error(`Error canceling schedule: ${err}`)
    return null
  }
}
async function markScheduleAsFired(id) {
  try {
    log.debug(`Marking ${id} as fired`)
    const schedule = await Schedule.get(id).run()
    schedule.fired = true
    await schedule.save()
    log.debug(`Successfully marked ${id} as fired`)
    return true
  } catch (err) {
    log.error(`Error marking schedule as fired: ${err}`)
    return null
  }
}

module.exports = {
  getUnfiredSchedules,
  setSchedule,
  cancelSchedule,
  markScheduleAsFired,
}
