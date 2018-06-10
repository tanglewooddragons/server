const Schedule = require('./models/schedule')
const log = require('../util/log')

async function getUnfiredSchedules() {
  try {
    const schedules = await Schedule.filter({
      fired: false,
    }).run()

    return schedules
  } catch (err) {
    log.error({
      action: 'get-unfired-schedules',
      status: 'failed',
    })

    return null
  }
}

async function setSchedule(options) {
  try {
    const schedule = new Schedule(options)
    await schedule.save()
    return schedule
  } catch (error) {
    log.error({
      action: 'set-schedule',
      status: 'failed',
      error,
    })

    return null
  }
}

async function cancelSchedule(id) {
  try {
    const schedule = await Schedule.get(id).run()
    await schedule.delete()
    return true
  } catch (error) {
    log.error({
      action: 'cancel-schedule',
      status: 'failed',
      error,
      data: {
        id,
      },
    })

    return null
  }
}

async function markScheduleAsFired(id) {
  try {
    const schedule = await Schedule.get(id).run()
    schedule.fired = true
    await schedule.save()
    return true
  } catch (error) {
    log.error({
      action: 'mark-schedule-as-fired',
      status: 'failed',
      error,
      data: {
        id,
      },
    })

    return null
  }
}

module.exports = {
  getUnfiredSchedules,
  setSchedule,
  cancelSchedule,
  markScheduleAsFired,
}
