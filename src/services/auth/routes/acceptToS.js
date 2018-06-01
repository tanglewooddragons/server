const { markToSAsAccepted } = require('db/user')

const acceptToS = async (ctx) => {
  const userId = ctx.state.user.id
  const result = await markToSAsAccepted(userId)
  ctx.body = result
}

module.exports = acceptToS
