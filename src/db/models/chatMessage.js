const thinky = require('../thinky')
const User = require('./user')

const ChatMessage = thinky.createModel('ChatMessage', {
  authorId: thinky.type.string().required(),
  text: thinky.type.string().required(),
  posted: thinky.type.date().default(thinky.r.now()),
  channel: thinky.type.string().required(),
})

ChatMessage.hasOne(User, 'author', 'authorId', 'id')

module.exports = ChatMessage
