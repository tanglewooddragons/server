const compareAsc = require('date-fns/compare_asc')
const log = require('util/log')

const DragonStatus = require('./models/dragonStatus')
const {
  getUserById,
} = require('./user')

async function getDragonStatus(dragonId) {
  log.debug(`Getting status of dragon ${dragonId}..`)
  try {
    const status = DragonStatus.filter({ dragonId }).run()
    log.debug(status, `Status of dragon ${dragonId}:`)
    return status
  } catch (err) {
    log.error(`Error getting dragon status: ${err}`)
    return null
  }
}

async function isDragonBusy(dragonId) {
  log.debug(`Checking if dragon ${dragonId} is busy..`)
  const status = await getDragonStatus(dragonId)

  const now = new Date()
  const endTime = status.endTime

  if (compareAsc(now, endTime) > -1) {
    log.debug(`Dragon ${dragonId} is not busy`)
    return {
      isBusy: false,
      details: {},
    }
  }

  log.debug(`Dragon ${dragonId} is busy`)
  return {
    isBusy: true,
    details: status,
  }
}

async function getUserDragonsStatuses(userId) {
  log.debug(`Getting dragon statuses for user: ${userId}`)
  const user = await getUserById(userId)
  const dragons = user.dragons
  try {
    const statuses = await Promise.all(
      dragons.map(dragon => isDragonBusy(dragon.id))
    )
    log.debug(statuses, 'Dragon statuses:')
    return statuses
  } catch (err) {
    log.error(`Error getting dragon statuses: ${err}`)
    return null
  }
}

module.exports = {
  getDragonStatus,
  isDragonBusy,
  getUserDragonsStatuses,
}
