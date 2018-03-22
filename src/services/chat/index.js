const {
  GET_TYPE,
  SEND_TYPE,
} = require('constants/chat')

const getMessages = require('./getMessages')
const sendMessage = require('./sendMessage')

const {
  registerHandler,
} = require('services/ws')

function initChatService() {
  registerHandler(GET_TYPE, getMessages)
  registerHandler(SEND_TYPE, sendMessage)
}

module.exports = initChatService
