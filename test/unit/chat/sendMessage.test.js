const sendMessage = require('services/chat/sendMessage')
const { getMessagesByChannel } = require('db/chatMessage')

describe('sendMessage', () => {
  test('Should return early when data is missing', async () => {
    const send = jest.fn()
    const socket = {
      send,
    }
    const missingData = {
      payload: {
        text: 'I do not have a channel',
      },
    }

    const result = await sendMessage(socket, missingData)
    expect(result).toBeNull()
    expect(send.mock.calls.length).toBe(1)
  })

  test(
    'Should call the broadcast function on socket when data is correct',
    async () => {
      const broadcast = jest.fn()
      const socket = {
        broadcast,
      }
      const data = {
        user: {
          id: '12',
        },
        payload: {
          text: 'What a great chat you got here',
          channel: 'general',
        },
      }

      await sendMessage(socket, data)
      expect(broadcast.mock.calls.length).toBe(1)
    }
  )

  test('Should add the message to db on success', async () => {
    const messages = await getMessagesByChannel('general')
    expect(messages.length).toBe(1)
  })

  test('Adds proper author to the message', async () => {
    const socket = {
      broadcast: () => {},
    }
    const data = {
      user: {
        id: '626',
      },
      payload: {
        text: 'Hello there',
        channel: 'general',
      },
    }

    const result = await sendMessage(socket, data)
    expect(result.authorId).toBe(data.user.id)
  })
})
