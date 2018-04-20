const { wss } = require('services/ws')
const { stringify } = require('util/json')
const { NOTIFICATION } = require('constants/notifications')

const send = (userId, notification) => {
  const message = stringify({
    type: NOTIFICATION,
    payload: notification,
  })

  wss.send(userId, message)
}

module.exports = send
