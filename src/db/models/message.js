const thinky = require('../thinky')
const User = require('./user')

const Message = thinky.createModel('Message', {
  topic: thinky.type.string().required(),
  text: thinky.type.string().required(),
  from: thinky.type.string().required(),
  to: thinky.type.string().required(),
  sent: thinky.type.date().default(thinky.r.now()),
})

Message.belongsTo(User, 'author', 'from', 'id')
Message.belongsTo(User, 'recipient', 'to', 'id')

module.exports = Message
