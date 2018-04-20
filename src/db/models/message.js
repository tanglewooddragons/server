const thinky = require('../thinky')
const User = require('./user')

const Message = thinky.createModel('Message', {
  userId: thinky.type.string().required(),
  topic: thinky.type.string().required(),
  text: thinky.type.string().required(),
  from: thinky.type.string().required(),
  to: thinky.type.string().required(),
})

Message.belongsTo(User, 'author', 'from', 'id')
Message.belongsTo(User, 'recipient', 'to', 'id')

module.exports = Message
