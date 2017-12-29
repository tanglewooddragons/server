const schedule = require('node-schedule')

const {
  markScheduleAsFired,
} = require('../../../db/schedule')
const log = require('../../../util/log')

const scheduleJob = function (job, resolve) {
  schedule.scheduleJob(
    job.id,
    job.scheduledFor,
    async () => {
      log.debug(`Job ${job.id} fired`)
      await resolve(job)
      await markScheduleAsFired(job.id)
    }
  )
}

module.exports = scheduleJob
