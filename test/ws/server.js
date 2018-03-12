const chai = require('chai')
const request = require('supertest')
const WebSocket = require('uws')

const { assert } = chai

const {
  initWsServer,
  registerHandler,
} = require('services/ws')

const {
  parse,
  stringify,
} = require('util/json')

module.exports = function (app) {
  describe('Server', async () => {
    let token
    let wss
    let socket
    before(async () => {
      // Login to get token
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      token = response.body.token
      wss = initWsServer()
    })

    beforeEach(() => {
      socket = new WebSocket('ws://localhost:8081')
    })

    afterEach(() => {
      socket.close()
    })

    it('Returns error when no token is provided', () => {
      socket.on('message', (message) => {
        const msg = parse(message)
        assert.equal(msg.type, 'AUTH_ERROR', 'Message type is invalid')
      })

      socket.on('open', () => {
        socket.send(stringify({
          type: 'test',
          payload: {
            testId: 44521,
          },
        }))
      })
    })

    it('Returns error when wrong token is provided', () => {
      socket.on('message', (message) => {
        const msg = parse(message)
        assert.equal(msg.type, 'AUTH_ERROR', 'Message type is invalid')
      })

      socket.on('open', () => {
        socket.send(stringify({
          type: 'test',
          payload: {
            token: 'I am a invalid token',
            testId: 44521,
          },
        }))
      })
    })

    it('Does not crash on unknown type of message', () => {
      socket.on('message', (message) => {
        const msg = parse(message)
        assert.equal(msg.type, 'ERROR', 'Message type is invalid')
      })

      socket.on('open', () => {
        socket.send(stringify({
          type: 'invalid-test',
          payload: {
            token,
            testId: 44521,
          },
        }))
      })
    })

    it('Calls handler with correct data', () => {
      const testHandler = (ws, data) => {
        assert(data.payload.testId === 321, 'Returns wrong data')
        assert.ok(data.user.id, 'It should send user id')
        assert.notOk(data.payload.token, 'Should not send token back')
      }

      registerHandler('test', testHandler)

      socket.on('open', () => {
        socket.send(stringify({
          type: 'test',
          payload: {
            token,
            testId: 321,
          },
        }))
      })
    })

    after(() => {
      wss.close()
    })
  })
}
