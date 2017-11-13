const { removeToken } = require('../redis/token')

const logout = async (ctx, next) => {
  const header = ctx.headers['authorization']
  const token = header.split(' ')[1]

  await removeToken(token)
  await next()
}

module.exports = logout
