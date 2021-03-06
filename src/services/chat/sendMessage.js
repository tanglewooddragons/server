const {
  addMessage,
} = require('db/chatMessage')
const {
  stringify,
} = require('util/json')
const {
  SEND_MESSAGE,
  NEW_MESSAGE,
  CHANNELS,
} = require('constants/chat')
const { ERROR_TYPE } = require('constants/ws')
const validate = require('services/validation')
const log = require('util/log')

const sendMessage = async (socket, data) => {
  const msgData = data.payload

  try {
    await validate(msgData, 'chatMessage')
  } catch (error) {
    socket.send(stringify({
      type: ERROR_TYPE,
      payload: {
        error,
      },
    }))

    log.error({
      action: 'send-chat-message',
      status: 'failed',
      error,
      data: {
        socket,
        data,
      },
    })

    return null
  }

  if (!CHANNELS.includes(msgData.channel.toLowerCase())) {
    socket.send(stringify({
      type: ERROR_TYPE,
      payload: {
        error: socket.__('chat.error.invalid_channel'),
      },
    }))

    return null
  }

  msgData.authorId = data.user.id

  const message = await addMessage(msgData)

  socket.broadcast(stringify({
    type: NEW_MESSAGE,
    payload: {
      message,
    },
  }))

  return message
}

module.exports = sendMessage
