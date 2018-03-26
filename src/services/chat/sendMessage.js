const {
  addMessage,
} = require('db/chatMessage')
const {
  stringify,
} = require('util/json')
const {
  NEW_MESSAGE,
  CHANNELS,
} = require('constants/chat')
const validate = require('services/validation')

const sendMessage = async (socket, data) => {
  const msgData = data.payload

  try {
    await validate(msgData, 'chatMessage')
  } catch (err) {
    socket.send(stringify({
      type: NEW_MESSAGE,
      payload: {
        error: err,
      },
    }))

    return null
  }

  if (!CHANNELS.includes(msgData.channel.toLowerCase())) {
    socket.send(stringify({
      type: NEW_MESSAGE,
      payload: {
        error: 'Invalid channel',
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
