const schedule = require('node-schedule')

const {
  markScheduleAsFired,
} = require('db/schedule')
const {
  getHandler,
} = require('../handlers')
const log = require('util/log')

const scheduleJob = function (job) {
  schedule.scheduleJob(
    job.id,
    job.scheduledFor,
    async () => {
      log.debug(`[Schedule] Job ${job.id} fired`)
      const handler = getHandler(job.type)
      try {
        await handler(job)
      } catch (handlerErr) {
        log.error(`[Schedule] Handler for ${job.id} returned error: ${handlerErr}`)
        return
      }
      await markScheduleAsFired(job.id)
    }
  )
}

module.exports = scheduleJob
