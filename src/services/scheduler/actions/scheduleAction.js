const {
  setSchedule,
} = require('../../../db/schedule')
const validate = require('../../../validation')
const log = require('../../../util/log')
const scheduleJob = require('./scheduleJob')

async function scheduleAction(options) {
  // Validate task options
  try {
    await validate(options, 'schedule')
  } catch (err) {
    log.error(err)
    return
  }

  // Save task to db
  const job = await setSchedule(options)

  // Set schedule
  scheduleJob(job)
}

module.exports = scheduleAction
