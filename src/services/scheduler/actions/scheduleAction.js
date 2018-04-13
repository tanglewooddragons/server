const {
  setSchedule,
} = require('db/schedule')
const validate = require('services/validation')
const log = require('util/log')
const scheduleJob = require('./scheduleJob')

async function scheduleAction(options) {
  // Validate task options
  try {
    await validate(options, 'schedule')
  } catch (err) {
    log.error(err)
    return
  }

  /*
    Schedules set by system use cron time so they
    are not valid date and should not be saved in db
  */
  const isDate = Date.parse(options.scheduledFor)

  if (isDate) {
    // Save job in database
    const job = await setSchedule(options)
    scheduleJob(job)
  } else {
    /*
      This should be a system schedule so it will be set up
      automatically on restart anyway
    */
    const job = {
      ...options,
      id: options.type,
    }
    scheduleJob(job)
  }
}

module.exports = scheduleAction
