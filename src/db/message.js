const Message = require('./models/message')
const log = require('util/log')

async function getReceivedMessages(userId) {
  log.debug(`Getting received messages for user: ${userId}`)
  try {
    const received = await Message.filter({ to: userId }).run()
    return received
  } catch (err) {
    log.error(`Error fetching messages: ${err}`)
    return null
  }
}

async function getSentMessages(userId) {
  log.debug(`Getting sent messages for user: ${userId}`)
  try {
    const sent = await Message.filter({ from: userId }).run()
    return sent
  } catch (err) {
    log.error(`Error fetching messages: ${err}`)
    return null
  }
}

async function getAllMessages(userId) {
  log.debug(`Getting all messages for user: ${userId}`)
  try {
    const received = await Message.filter({ to: userId }).run()
    const sent = await Message.filter({ from: userId }).run()
    return {
      received,
      sent,
    }
  } catch (err) {
    log.error(`Error fetching messages: ${err}`)
    return null
  }
}

async function sendMessage(message) {
  log.debug(message, 'Saving message..')
  try {
    const newMessage = new Message(message)
    await newMessage.save()
    return newMessage
  } catch (err) {
    log.error(`Error saving message: ${err}`)
    return null
  }
}
// async function deleteMessage() {}

module.exports = {
  getReceivedMessages,
  getSentMessages,
  getAllMessages,
  sendMessage,
  // deleteMessage,
}
