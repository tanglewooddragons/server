const Dragon = require('./models/dragon')
const log = require('../util/log')

async function createDragon() {}
async function updateDragon() {}
async function removeDragon() {}
async function getUserDragons(userId) {}

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

module.exports = {
  createDragon,
  updateDragon,
  removeDragon,
  getUserDragons,
  getDragonById,
}
