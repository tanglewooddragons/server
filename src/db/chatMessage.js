const ChatMessage = require('./models/chatMessage')
const log = require('util/log')
const {
  MESSAGE_FETCH_LIMIT,
} = require('constants/chat')

async function getMessagesByChannel(channel) {
  log.debug(`Fetching messages for channel: ${channel}`)
  const messages = await ChatMessage
    .filter({ channel })
    .limit(MESSAGE_FETCH_LIMIT)
    .orderBy('posted')
    .getJoin({
      author: {
        _apply(sequence) {
          return sequence.without('password')
        },
      },
    })
    .run()

  if (!messages) return null

  return messages
}

async function addMessage(message) {
  try {
    const newMessage = new ChatMessage(message)
    await newMessage.save()
    return newMessage
  } catch (error) {
    log.error({
      action: 'add-message',
      status: 'failed',
      error,
      data: {
        message,
      },
    })
    return null
  }
}

module.exports = {
  getMessagesByChannel,
  addMessage,
}
