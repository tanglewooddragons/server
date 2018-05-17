const Location = require('./models/location')
const log = require('util/log')

async function getLocation(name) {
  try {
    const location = await Location.filter({ name }).run()
    return location[0]
  } catch (err) {
    log.error(`Location not found: ${name}`)
    return null
  }
}

async function addLocation(locationData) {
  try {
    // Check if location already exists
    const name = locationData.name
    const exists = await getLocation(name)

    if (exists) {
      log.info(`Location ${name} already exists, skipping..`)
      return exists
    }

    const location = new Location(locationData)
    await location.save()
    log.info(`Location ${name} has been added successfully!`)
    return location
  } catch (err) {
    log.error(`Error adding location: ${err}`)
    return null
  }
}

module.exports = {
  addLocation,
  getLocation,
}
