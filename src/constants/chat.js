const CHANNELS = [
  'general',
  'trade',
]

// Limits how much messages can be returned from db
const MESSAGE_FETCH_LIMIT = 200

// WS event type names
const GET_TYPE = 'GET_MESSAGES'
const MESSAGES_TYPE = 'MESSAGES'
const SEND_TYPE = 'SEND_MESSAGE'
const NEW_MESSAGE = 'NEW_MESSAGE'

module.exports = {
  CHANNELS,
  MESSAGE_FETCH_LIMIT,
  GET_TYPE,
  MESSAGES_TYPE,
  SEND_TYPE,
  NEW_MESSAGE,
}
