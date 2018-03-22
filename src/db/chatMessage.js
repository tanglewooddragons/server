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
    .run()

  if (!messages) return null

  log.debug(`Got ${messages.length} messages`)
  return messages
}

async function addMessage(message) {
  log.debug(message, 'Adding chat message to db')

  try {
    const newMessage = new ChatMessage(message)
    await newMessage.save()
    log.debug('Message added successfully')
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
