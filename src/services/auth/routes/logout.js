const { removeToken } = require('db/token')

const logout = async (ctx) => {
  const token = ctx.request.body.refreshToken
  await removeToken(token)
}

module.exports = logout
