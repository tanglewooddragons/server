const Rarity = require('./models/rarity')
const log = require('util/log')

async function addRarity(rarityData) {
  try {
    const rarities = await Rarity.filter({ name: rarityData.name }).run()
    const exists = rarities[0]

    if (exists) {
      log.info(`Rarity ${rarityData.name} already exists, skipping..`)
      return exists
    }

    const rarity = new Rarity(rarityData)
    await rarity.save()
    log.info(`Rarity ${rarity.name} has been added successfully!`)
    return rarity
  } catch (err) {
    log.error(`Error adding rarity: ${err}`)
    return null
  }
}

module.exports = {
  addRarity,
}
