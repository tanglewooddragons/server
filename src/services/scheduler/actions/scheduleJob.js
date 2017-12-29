const schedule = require('node-schedule')

const {
  markScheduleAsFired,
} = require('../../../db/schedule')
const {
  getHandler,
} = require('../handlers')
const log = require('../../../util/log')

const scheduleJob = function (job) {
  schedule.scheduleJob(
    job.id,
    job.scheduledFor,
    async () => {
      log.debug(`Job ${job.id} fired`)
      const handler = getHandler(job.type)
      await handler(job)
      await markScheduleAsFired(job.id)
    }
  )
}

module.exports = scheduleJob
