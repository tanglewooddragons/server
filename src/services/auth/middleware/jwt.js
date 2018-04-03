const koaJwt = require('koa-jwt')

const {
  getTokens,
} = require('db/token')

const isRevoked = async (ctx, decoded, token) => {
  const entries = await getTokens(decoded.id)
  const valid = entries.find(entry => entry.token === token)

  if (!valid) return true
  return false
}

const jwt = koaJwt({
  secret: process.env.JWT_SECRET,
  isRevoked,
})

module.exports = jwt
