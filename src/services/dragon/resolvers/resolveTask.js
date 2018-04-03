const log = require('util/log')

module.exports = (data) => {
  log.debug(`Resolved task ${data.id}`)
}
