const log = require('./log')

const parse = (json) => {
  try {
    return JSON.parse(json)
  } catch (err) {
    log.error(`Error parsing JSON: ${err}`)
    return null
  }
}

const stringify = (json) => {
  try {
    return JSON.stringify(json)
  } catch (err) {
    log.error(`Error stringifing JSON: ${err}`)
    return null
  }
}

module.exports = {
  parse,
  stringify,
}
