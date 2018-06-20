require('dotenv').load()

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const thinky = require('../src/db/thinky')
const { addItem } = require('../src/db/item')
const { addLocation } = require('../src/db/location')

const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const locationsPath = path.resolve('./src/db/seed/locations')
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

  const items = {}

  await addEntities(ingredientsPath, async (item) => {
    const newItem = await addItem(item)
    items[newItem.name] = newItem.id
  })

  await addEntities(locationsPath, async (location) => {
    const updatedDrop = location.possibleDrop.map(item =>
      Object.assign({}, item, {
        itemId: items[item.name],
        name: undefined,
      })
    )

    await addLocation(Object.assign({}, location, {
      possibleDrop: updatedDrop,
    }))
  })


  thinky.r.getPoolMaster().drain()
}

run()
