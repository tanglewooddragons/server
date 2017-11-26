const { removeToken } = require('../../db/token')

const logout = async (ctx, next) => {
  const header = ctx.headers['authorization']
  if (!header) return
  const token = header.split(' ')[1]

  await removeToken(token)
  await next()
}

module.exports = logout
