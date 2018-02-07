const schedule = require('node-schedule')

const {
  cancelSchedule,
} = require('db/schedule')

const cancel = async function (id) {
  const job = schedule.scheduledJobs[id]
  job.cancel()
  await cancelSchedule(id)
}

module.exports = cancel
