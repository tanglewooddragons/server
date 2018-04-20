const { wss } = require('services/ws')
const { stringify } = require('util/json')

const send = (userId, notification) => {
  const message = stringify(notification)
  wss.send(userId, message)
}

module.exports = send
