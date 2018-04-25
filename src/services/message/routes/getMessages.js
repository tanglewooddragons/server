const { getAllMessages } = require('db/message')

const getMessages = async (ctx) => {
  const userId = ctx.state.user.id
  const messages = await getAllMessages(userId)

  ctx.body = messages
}

module.exports = getMessages
