const thinky = require('../thinky')
const User = require('./user')

const ChatMessage = thinky.createModel('ChatMessage', {
  text: thinky.type.string().required(),
  posted: thinky.type.date().default(thinky.r.now()),
  channel: thinky.type.string().required(),
})

ChatMessage.belongsTo(User, 'author', 'author', 'id')

module.exports = ChatMessage
