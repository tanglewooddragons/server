const schedule = require('node-schedule')

const {
  setSchedule,
  markScheduleAsFired,
} = require('../../../db/schedule')
const validate = require('../../../validation')
const log = require('../../../util/log')

async function scheduleTask(options, resolve) {
  // Validate task options
  try {
    await validate(options, 'task')
  } catch (err) {
    log.error(err)
    return
  }

  // Save task to db
  const task = await setSchedule(Object.assign({}, options, { type: 'task' }))

  // Set schedule with node-schedule using id from db so we can retrieve it later
  schedule.scheduleJob(
    task.id,
    task.scheduledFor,
    async () => {
      log.debug(`Task ${task.id} fired`)
      await resolve(task)
      await markScheduleAsFired(task.id)
    }
  )
}

module.exports = scheduleTask
