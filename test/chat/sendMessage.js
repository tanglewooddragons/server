const chai = require('chai')
const spies = require('chai-spies')

const sendMessage = require('services/chat/sendMessage')

const {
  getMessagesByChannel,
} = require('db/chatMessage')


const { assert, expect } = chai
chai.use(spies)

module.exports = function () {
  describe('sendMessage', () => {
    it('Should return early when data is missing', async () => {
      const send = chai.spy()
      const socket = {
        send,
      }
      const missingData = {
        payload: {
          text: 'I do not have a channel',
        },
      }

      const result = await sendMessage(socket, missingData)
      assert.equal(result, null, 'It did not return early')
      expect(send).to.have.been.called()
    })

    it('Should call the broadcast function on socket when data is correct', async () => {
      const spy = chai.spy()
      const socket = {
        broadcast: spy,
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
      expect(spy).to.have.been.called()
    })

    it('Should add the message to db on success', async () => {
      const messages = await getMessagesByChannel('general')
      assert.equal(messages.length, 1, 'It didnt add the message to db')
    })

    it('Adds proper author to the message', async () => {
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
      assert.equal(result.authorId, data.user.id, 'It didnt set author correctly')
    })
  })
}
