const { removeAllTokens } = require('db/token')

const logoutAll = async (ctx) => {
  const userId = ctx.state.user
  if (!userId) return

  await removeAllTokens(userId)
}

module.exports = logoutAll
