const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const thinky = require('../src/db/thinky')
const { addLocation } = require('../src/db/location')

const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const locationsPath = path.resolve('./src/db/seed/locations')

const run = async () => {
  await thinky.dbReady()

  const locationFiles = await readDir(locationsPath)

  await Promise.all(locationFiles.map(async (fileName) => {
    const filePath = path.join(locationsPath, fileName)
    const file = await readFile(filePath, 'utf8')

    try {
      const location = JSON.parse(file)
      await addLocation(location)
    } catch (err) {
      console.error(`Error parsing location file: ${err}`)
    }
  }))

  thinky.r.getPoolMaster().drain()
}

run()
