const compareAsc = require('date-fns/compare_asc')
const log = require('util/log')

const DragonStatus = require('./models/dragonStatus')
const {
  getUserById,
} = require('./user')

async function getDragonStatus(dragonId) {
  try {
    const status = await DragonStatus.filter({ dragonId }).run()
    return status[0]
  } catch (error) {
    log.error({
      action: 'get-dragon-status',
      status: 'failed',
      error,
      data: {
        dragonId,
      },
    })
    return null
  }
}

async function isDragonBusy(dragonId) {
  const status = await getDragonStatus(dragonId)

  const now = new Date()
  const endTime = status.endTime

  if (compareAsc(now, endTime) > -1) {
    return {
      isBusy: false,
      details: {},
    }
  }

  return {
    isBusy: true,
    details: status,
  }
}

async function getUserDragonsStatuses(userId) {
  const user = await getUserById(userId)
  const dragons = user.dragons
  try {
    const statuses = await Promise.all(
      dragons.map(dragon => isDragonBusy(dragon.id))
    )
    return statuses
  } catch (error) {
    log.error({
      action: 'get-user-dragon-statuses',
      status: 'failed',
      error,
      data: {
        userId,
      },
    })

    return null
  }
}

async function setDragonAsBusy(dragonId, task) {
  try {
    const status = await getDragonStatus(dragonId)
    await status.merge(task)
    await status.save()
    return status
  } catch (error) {
    log.error({
      action: 'set-dragon-as-busy',
      status: 'failed',
      error,
      data: {
        dragonId,
        task,
      },
    })

    return null
  }
}

module.exports = {
  getDragonStatus,
  isDragonBusy,
  getUserDragonsStatuses,
  setDragonAsBusy,
}
