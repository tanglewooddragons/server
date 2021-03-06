const addHours = require('date-fns/add_hours')

const { getLocation } = require('db/location')
const validate = require('services/validation')
const { scheduleAction } = require('services/scheduler')
const {
  isDragonBusy,
  setDragonAsBusy,
} = require('db/dragonStatus')
const log = require('util/log')

const sendOnTask = async (ctx) => {
  const body = ctx.request.body

  try {
    await validate(body, 'task')
  } catch (validationError) {
    log.error({
      action: 'send-on-task',
      status: 'failed',
      error: validationError,
      data: {
        body,
      },
    })

    ctx.throw(422, validationError)
  }

  const {
    dragonId,
    duration,
    location,
  } = body

  const locationExists = await getLocation(location)

  if (!locationExists) {
    ctx.throw(400, ctx.i18n.__('dragon.error.invalid_location'))
    return
  }

  const status = await isDragonBusy(dragonId)

  if (status.isBusy) {
    ctx.throw(400, ctx.i18n.__('dragon.error.is_busy'))
    return
  }

  const now = Date.now()
  const type = 'task'
  const scheduledFor = addHours(Date.now(), duration)
  const details = {
    location,
    dragonId,
  }

  const set = await setDragonAsBusy(dragonId, {
    dragonId,
    type,
    startTime: now,
    endTime: scheduledFor,
    duration,
    details,
  })

  if (!set) ctx.throw(400, ctx.i18n.__('dragon.error.setting_task'))

  await scheduleAction({
    scheduledBy: ctx.state.user.id,
    scheduledFor,
    type,
    details,
  })

  ctx.body = {
    startTime: now,
    endTime: scheduledFor,
  }
}

module.exports = sendOnTask
