const jwt = require('jsonwebtoken')

const { getToken } = require('db/token')
const {
  ACCESS_TOKEN_LIFETIME,
} = require('constants/auth')

const isRevoked = async (token) => {
  const entry = await getToken(token)
  if (!entry) return true
  return false
}

const refreshToken = async (ctx) => {
  const token = ctx.request.body.refreshToken

  if (await isRevoked(token)) {
    ctx.throw(400, 'Token expired')
    return
  }

  const tokenBody = ctx.state.user

  const accessToken = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: Date.now() + (ACCESS_TOKEN_LIFETIME),
  })

  ctx.body = {
    accessToken,
  }
}

module.exports = refreshToken
