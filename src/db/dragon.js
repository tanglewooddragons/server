const Dragon = require('./models/dragon')
const DragonStatus = require('./models/dragonStatus')
const log = require('../util/log')

async function createDragon(options) {
  try {
    const dragon = new Dragon(options)
    await dragon.save()
    const status = new DragonStatus({
      dragonId: dragon.id,
    })
    await status.save()
    return dragon
  } catch (error) {
    log.error({
      action: 'create-dragon',
      status: 'failed',
      error,
      data: {
        options,
      },
    })

    return null
  }
}

async function updateDragon(id, update) {
  try {
    const dragon = await Dragon.get(id).run()
    await dragon.merge(update)
    await dragon.save()
    return dragon
  } catch (error) {
    log.error({
      action: 'update-dragon',
      status: 'failed',
      error,
      data: {
        id,
        update,
      },
    })

    return null
  }
}

async function removeDragonById(id) {
  log.info({
    action: 'remove-dragon',
    status: 'pending',
    data: {
      id,
    },
  })

  try {
    const dragon = await Dragon.get(id).run()
    await dragon.delete()

    log.info({
      action: 'remove-dragon',
      status: 'success',
      data: {
        id,
      },
    })

    return true
  } catch (error) {
    log.error({
      action: 'remove-dragon',
      status: 'failed',
      error,
      data: {
        id,
      },
    })

    return null
  }
}

async function getDragonById(id) {
  try {
    const dragon = await Dragon.get(id).run()

    if (!dragon) return null
    return dragon
  } catch (err) {
    log.error({
      action: 'get-dragon-by-id',
      status: 'failed',
      error: err,
      data: {
        id,
      },
    })

    return null
  }
}

async function resetFeedStatus() {
  log.info({
    action: 'reset-feed-status',
    status: 'pending',
  })

  try {
    const dragons = await Dragon.filter({}).run()
    dragons.forEach(async (dragon) => {
      dragon.fed = false
      await dragon.save()
    })

    log.info({
      action: 'reset-feed-status',
      status: 'success',
    })

    return true
  } catch (err) {
    log.error({
      action: 'reset-feed-status',
      status: 'failed',
      error: err,
    })
    return null
  }
}

module.exports = {
  createDragon,
  updateDragon,
  removeDragonById,
  getDragonById,
  resetFeedStatus,
}
