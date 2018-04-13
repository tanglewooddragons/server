const request = require('supertest')
const WebSocket = require('uws')

const {
  wss,
  registerHandler,
} = require('services/ws')

const {
  parse,
  stringify,
} = require('util/json')

module.exports = function (app) {
  describe('Server', async () => {
    let token
    let socket
    beforeAll(async () => {
      // Login to get token
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      token = response.body.accessToken
      wss.init()
    })

    beforeEach(() => {
      socket = new WebSocket('ws://localhost:8081')
    })

    afterEach(() => {
      socket.close()
    })

    test('Returns error when no token is provided', (done) => {
      socket.on('message', (message) => {
        const msg = parse(message)
        expect(msg.type).toBe('AUTH_ERROR')
        done()
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

    test('Returns error when wrong token is provided', (done) => {
      socket.on('message', (message) => {
        const msg = parse(message)
        expect(msg.type).toBe('AUTH_ERROR')
        done()
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

    test('Does not crash on unknown type of message', (done) => {
      socket.on('message', (message) => {
        const msg = parse(message)
        expect(msg.type).toBe('TYPE_ERROR')
        done()
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

    test('Calls handler with correct data', (done) => {
      const testHandler = (ws, data) => {
        expect(data.payload.testId).toBe(321)
        expect(data.user.id).toBeDefined()
        expect(data.payload.token).not.toBeDefined()
        done()
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

    afterAll(() => {
      wss.close()
    })
  })
}
