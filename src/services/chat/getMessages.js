const {
  getMessagesByChannel,
} = require('db/chatMessage')
const {
  CHANNELS,
  MESSAGES_TYPE,
} = require('constants/chat')
const {
  stringify,
} = require('util/json')

const getMessages = async (socket, data) => {
  const channel = data.payload.channel

  if (!channel) {
    socket.send(stringify({
      type: MESSAGES_TYPE,
      payload: {
        error: socket.__('chat.error.no_channel'),
      },
    }))

    return null
  }

  if (!CHANNELS.includes(channel.toLowerCase())) {
    socket.send(stringify({
      type: MESSAGES_TYPE,
      payload: {
        error: socket.__('chat.error.invalid_channel'),
      },
    }))

    return null
  }

  const messages = await getMessagesByChannel(channel)

  // Send messages
  socket.send(stringify({
    type: MESSAGES_TYPE,
    payload: {
      messages,
    },
  }))

  return messages
}

module.exports = getMessages
