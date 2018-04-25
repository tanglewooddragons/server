const { getReceivedMessages } = require('db/message')

const getMessages = async (ctx) => {
  const userId = ctx.state.user.id
  const messages = await getReceivedMessages(userId)

  ctx.body = messages
}

module.exports = getMessages
