const {
  addMessage,
} = require('db/chatMessage')
const {
  stringify,
} = require('util/json')
const {
  NEW_MESSAGE,
} = require('constants/chat')
const validate = require('services/validation')

const sendMessage = async (socket, data) => {
  const msgData = data.payload

  try {
    await validate(msgData, 'chatMessage')
  } catch (err) {
    // send error
    return
  }

  const message = await addMessage(msgData)

  // Broadcast new state to every socket
  socket.broadcast(stringify({
    type: NEW_MESSAGE,
    payload: {
      message,
    },
  }))
}

module.exports = sendMessage
