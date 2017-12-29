const {
  setSchedule,
} = require('../../../db/schedule')
const validate = require('../../../validation')
const log = require('../../../util/log')
const getResolver = require('../resolvers')
const scheduleJob = require('./scheduleJob')

async function scheduleAction(options, resolve) {
  // Validate task options
  try {
    await validate(options, options.type || 'task')
  } catch (err) {
    log.error(err)
    return
  }

  // Save task to db
  const job = await setSchedule(options)

  // Get type resolver
  const resolver = resolve || getResolver(job.type)

  // Set schedule
  scheduleJob(job, resolver)
}

module.exports = scheduleAction
