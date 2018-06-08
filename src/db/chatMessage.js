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
  log.debug(message, 'Adding chat message to db')

  try {
    const newMessage = new ChatMessage(message)
    await newMessage.save()
    return newMessage
  } catch (err) {
    log.error(`Error adding message to db: ${err}`)
    return null
  }
}

module.exports = {
  getMessagesByChannel,
  addMessage,
}
