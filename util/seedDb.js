const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const thinky = require('../src/db/thinky')
const { addLocation } = require('../src/db/location')
const { addRarity } = require('../src/db/rarity')
const { addItem } = require('../src/db/item')

const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const locationsPath = path.resolve('./src/db/seed/locations')
const raritiesPath = path.resolve('./src/db/seed/rarities')
const ingredientsPath = path.resolve('./src/db/seed/ingredients')

const addEntities = async (entitiesPath, adder) => {
  const files = await readDir(entitiesPath)

  await Promise.all(files.map(async (fileName) => {
    const filePath = path.join(entitiesPath, fileName)
    const file = await readFile(filePath, 'utf8')

    try {
      const entity = JSON.parse(file)
      await adder(entity)
    } catch (err) {
      console.error(`Error parsing location file: ${err}`)
    }
  }))
}

const run = async () => {
  await thinky.dbReady()

  await addEntities(locationsPath, addLocation)
  await addEntities(raritiesPath, addRarity)
  await addEntities(ingredientsPath, addItem)

  thinky.r.getPoolMaster().drain()
}

run()
