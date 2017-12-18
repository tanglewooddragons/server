const Dragon = require('./models/dragon')
const log = require('../util/log')

async function createDragon(options) {
  try {
    log.debug(`Creating new dragon: ${options.name}`)
    const dragon = new Dragon(options)
    await dragon.save()
    log.debug(`Dragon ${options.name} created successfully!`)
    return dragon
  } catch (err) {
    log.error(`Error creating dragon: ${err}`)
    return null
  }
}

async function updateDragon(id, update) {
  try {
    log.debug(update, `Updating dragon by id: ${id}`)
    const dragon = await Dragon.get(id).run()
    await dragon.merge(update)
    await dragon.save()
    log.debug(dragon, 'Dragon updated successfully')
    return dragon
  } catch (err) {
    log.error(`Error updating dragon: ${err}`)
    return null
  }
}

async function removeDragonById(id) {
  try {
    log.debug(`Removing dragon: ${id}`)
    const dragon = await Dragon.get(id).run()
    await dragon.delete()
    log.debug(`Dragon ${id} has been removed`)
    return true
  } catch (err) {
    log.error(`Error removing dragon: ${err}`)
    return null
  }
}

async function getDragonById(id) {
  try {
    log.debug(`Getting dragon by id: ${id}`)
    const dragon = await Dragon.get(id).run()

    if (!dragon) return null
    return dragon
  } catch (err) {
    log.error(`Error fetching dragon: ${err}`)
    return null
  }
}

async function getUserDragons(userId) {}

module.exports = {
  createDragon,
  updateDragon,
  removeDragonById,
  getUserDragons,
  getDragonById,
}
