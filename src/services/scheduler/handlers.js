const log = require('util/log')

const handlers = {}

const registerHandler = (type, handler) => {
  log.debug(`[Schedule] Registering handler for type ${type}`)
  handlers[type] = handler
}

const getHandler = type => handlers[type]

module.exports = {
  registerHandler,
  getHandler,
}
