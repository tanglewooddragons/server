const s = require('node-schedule')
const { Schedule } = require('./db')
const log = require('./util/logger')

const updateInDb = async (data) => {
  try {
    const schedule = await Schedule.findOneAndUpdate({ id: data.id }, {
      fired: true
    })

    await schedule.save()
  } catch (e) {
    log.error(`Error updating schedule (id: ${data.id}): ${e}`)
  }
}

const fireSchedule = (data, send) => {
  send(`schedule.job.${data.id}`, data)
  log.info(`Fired schedule ${data.id}`)
}

const schedule = async (data, send) => {
  const statusChannel = `schedule.status.${data.id}`

  // @TODO Add basic validation, Joi was giving me a headache with mongo docs

  if (new Date(data.date).getTime() < Date.now()) {
    fireSchedule(data, send)
    return
  }

  const {
    id,
    date,
    type
  } = data

  // Save the schedule to DB
  try {
    const schedule = new Schedule({
      id: id,
      scheduled: Date.now(),
      date: date,
      data: data,
      fired: false
    })
    
    await schedule.save()
  } catch(e) {
    log.error('Error saving schedule to db: ', e)
  }

  s.scheduleJob(date, async function(data, send) {
    await updateInDb(data)
    fireSchedule(data, send)
  }.bind(null, data, send))

  send(statusChannel, `Job ${id} scheduled successfully`)
}

const restoreSchedules = async (send) => {
  // Restore every unfired schedule from db
  const schedules = await Schedule.find({
    fired: false
  }).exec()

  log.info(`Restoring schedules: ${schedules.length}`)
  await Promise.all(schedules.map(s => schedule(s, send)))
}

module.exports = {
  restoreSchedules,
  schedule
}
