const { getSentMessages } = require('db/message')

const getMessages = async (ctx) => {
  const userId = ctx.state.user.id
  const messages = await getSentMessages(userId)

  ctx.body = messages
}

module.exports = getMessages
