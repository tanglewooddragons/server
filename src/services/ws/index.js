const ws = require('uws')
const jwt = require('jsonwebtoken')

const {
  getToken,
} = require('db/token')

const log = require('util/log')

const {
  parse,
  stringify,
} = require('util/json')

const handlers = {}

const registerHandler = (type, handler) => {
  log.debug(`[WS] Registered a handler for type ${type}`)
  handlers[type] = handler
}
const getHandler = type => handlers[type]

function initWsServer({ port = 8081 } = {}) {
  log.info('Starting WebSocket server..')

  const wss = new ws.Server({
    port,
  })

  log.info(`WebSocket server listening at port ${port}`)

  wss.on('connection', (socket) => {
    log.debug(socket, 'New WebSocket connection')

    socket.on('message', async (message) => {
      // Parse the message
      const msg = parse(message)

      log.debug(msg, 'Received Websocket message')

      if (!msg.payload) return

      // Check if user is authenticated
      const token = msg.payload.token

      if (!token) {
        // Return auth error - no token
        socket.send(stringify({
          type: 'AUTH_ERROR',
          payload: {
            message: 'Token required to perform this action',
          },
        }))
        return
      }

      let decoded

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
      } catch (err) {
        log.error(`Error decoding token: ${err}`)
        return
      }

      const entry = await getToken(decoded.id)

      if (!entry || entry.token !== token) {
        // Return auth error - invalid token
        socket.send(stringify({
          type: 'AUTH_ERROR',
          payload: {
            message: 'PRovided token is invalid',
          },
        }))
        return
      }

      // Attach user object to data
      const data = {
        payload: msg.payload,
        user: {
          id: decoded.id,
        },
      }

      delete data.payload.token

      // Determine handler
      const type = msg.type
      const handler = getHandler(type)

      if (!handler) {
        socket.send(stringify({
          type: 'TYPE_ERROR',
          payload: {
            message: 'Invalid type property',
          },
        }))
        return
      }

      // Fire handler
      handler(socket, data)
    })
  })

  return wss
}

module.exports = {
  initWsServer,
  registerHandler,
}
