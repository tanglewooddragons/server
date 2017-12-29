const scheduleJob = require('./scheduleJob')

const {
  getUnfiredSchedules,
  markScheduleAsFired,
} = require('../../../db/schedule')
const getResolver = require('../resolvers')

async function restoreSchedules() {
  const schedules = await getUnfiredSchedules()

  schedules.forEach(async (schedule) => {
    // get resolver for schedule type
    const resolver = getResolver(schedule.type)

    // If schedule is past-due fire it immedietly
    if (schedule.scheduledFor < Date.now()) {
      await resolver(schedule)
      await markScheduleAsFired(schedule.id)
      return
    }

    // set schedule to run
    scheduleJob(schedule, resolver)
  })
}

module.exports = restoreSchedules
