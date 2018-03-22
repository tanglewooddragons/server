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
        error: 'No channel',
      },
    }))

    return
  }

  if (!CHANNELS.includes(channel)) {
    socket.send(stringify({
      type: MESSAGES_TYPE,
      payload: {
        error: 'Invalid channel',
      },
    }))

    return
  }

  const messages = await getMessagesByChannel(channel)

  // Send messages
  socket.send(stringify({
    type: MESSAGES_TYPE,
    payload: {
      messages,
    },
  }))
}

module.exports = getMessages
