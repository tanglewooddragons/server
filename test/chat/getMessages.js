const getMessages = require('services/chat/getMessages')

module.exports = function () {
  describe('getMessages', () => {
    test('Should return null when no channel is specified', async () => {
      const socket = {
        send: () => {},
      }

      const data = {
        payload: {},
      }

      const messages = await getMessages(socket, data)
      expect(messages).toBeNull()
    })

    test('Should return null when channel is incorrect', async () => {
      const socket = {
        send: () => {},
      }

      const data = {
        payload: {
          channel: 'fishing marathon 9000',
        },
      }

      const messages = await getMessages(socket, data)
      expect(messages).toBeNull()
    })

    test('Should returns messages when channel is correct', async () => {
      const socket = {
        send: () => {},
      }
      const data = {
        payload: {
          channel: 'general',
        },
      }

      const messages = await getMessages(socket, data)
      expect(messages.length).toBeGreaterThan(0)
    })
  })
}
