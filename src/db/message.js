const Message = require('./models/message')
const log = require('util/log')

async function getReceivedMessages(userId) {
  try {
    const received = await Message
      .filter({ to: userId })
      .getJoin({
        author: true,
      })
      .run()
    return received
  } catch (error) {
    log.error({
      action: 'get-received-messages',
      status: 'failed',
      error,
      data: {
        userId,
      },
    })

    return null
  }
}

async function getSentMessages(userId) {
  try {
    const sent = await Message
      .filter({ from: userId })
      .getJoin({
        recipient: true,
      })
      .run()
    return sent
  } catch (error) {
    log.error({
      action: 'get-sent-messages',
      status: 'failed',
      error,
      data: {
        userId,
      },
    })

    return null
  }
}

async function getAllMessages(userId) {
  try {
    const [received, sent] = await Promise.all([
      Message.filter({ to: userId }).getJoin({ author: true }).run(),
      Message.filter({ from: userId }).getJoin({ recipient: true }).run(),
    ])
    return {
      received,
      sent,
    }
  } catch (error) {
    log.error({
      action: 'get-all-messages',
      status: 'failed',
      error,
      data: {
        userId,
      },
    })
    return null
  }
}

async function sendMessage(message) {
  try {
    const newMessage = new Message(message)
    await newMessage.save()
    return newMessage
  } catch (error) {
    log.error({
      action: 'send-message',
      status: 'failed',
      error,
      data: {
        message,
      },
    })

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
