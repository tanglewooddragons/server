const ws = require('uws')
const jwt = require('jsonwebtoken')

const log = require('util/log')
const {
  parse,
  stringify,
} = require('util/json')

const getTranslatedMessage = require('./getTranslatedMessage')

const handlers = {}

const registerHandler = (type, handler) => {
  log.debug(`[WS] Registered a handler for type ${type}`)
  handlers[type] = handler
}
const getHandler = type => handlers[type]

class WSServer {
  conststructor() {
    this.wss = null
    this.clients = {}
  }

  init({ port = 8081 } = {}) {
    log.info('Starting WebSocket server..')

    this.wss = new ws.Server({
      port,
    })

    log.info(`WebSocket server listening at port ${port}`)
    this.initHandlers()
  }

  initHandlers() {
    this.wss.on('connection', (socket) => {
      socket.broadcast = (message) => {
        if (!this.wss.clients) return

        this.wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(message)
          }
        })
      }

      socket.on('message', async (message) => {
        // Parse the message
        const msg = parse(message)
        if (!msg.payload) return

        // Check if user is authenticated
        const token = msg.payload.token

        if (!token) {
          // Return auth error - no token
          socket.send(stringify({
            type: 'AUTH_ERROR',
            payload: {
              error: 'Token required to perform this action',
            },
          }))
          return
        }

        let decoded

        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
          log.error({
            action: 'ws-on-message',
            status: 'failed',
            error,
            data: {
              socket,
              message,
            },
          })

          socket.send(stringify({
            type: 'AUTH_ERROR',
            payload: {
              error: 'Provided token is invalid',
            },
          }))
          return
        }

        const locale = decoded.locale

        // Attach user object to data
        const data = {
          payload: msg.payload,
          user: {
            id: decoded.id,
            locale,
          },
        }

        // Attach translated messages to socket
        socket.__ = getTranslatedMessage(locale)

        socket.userId = data.user.id

        delete data.payload.token

        // Determine handler
        const type = msg.type
        const handler = getHandler(type)

        if (!handler) {
          socket.send(stringify({
            type: 'TYPE_ERROR',
            payload: {
              error: socket.__('ws.error.invalid_type'),
            },
          }))
          return
        }

        // Fire handler
        handler(socket, data)
      })
    })
  }

  send(userId, message) {
    if (!this.wss.clients) return

    /*
      Think about holding a clients map as this loop
      could easily go out of hand with a lot of users
    */

    this.wss.clients.forEach((client) => {
      if (client.userId === userId) {
        client.send(message)
        log.debug(message, `Send a message to user: ${userId}`)
      }
    })
  }

  broadcast(message) {
    if (!this.wss) {
      log.error('[WS] Server must be initialzied first')
      return
    }

    if (!this.wss.clients) return

    this.wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message)
      }
    })
  }

  close() {
    if (!this.wss) {
      log.error('[WS] Server must be initialzied first')
      return
    }

    this.wss.close()
  }
}

const wss = new WSServer()

module.exports = {
  wss,
  registerHandler,
}
