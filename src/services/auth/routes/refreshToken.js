const jwt = require('jsonwebtoken')

const { getToken } = require('db/token')
const { getLoginInfo } = require('db/user')
const { ACCESS_TOKEN_LIFETIME } = require('constants/auth')

const isRevoked = async (token) => {
  const entry = await getToken(token)
  if (!entry) return true
  return false
}

const refreshToken = async (ctx) => {
  const token = ctx.request.body.refreshToken

  if (await isRevoked(token)) {
    ctx.throw(400, ctx.i18n.__('auth.error.token_expires'))
    return
  }

  const email = ctx.state.user.email
  const { isBanned } = await getLoginInfo(email)

  if (isBanned) {
    ctx.throw(403, ctx.i18n.__('auth.error.banned'))
    return
  }

  const tokenBody = {
    id: ctx.state.user.id,
    role: ctx.state.user.role,
  }

  const accessToken = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: Date.now() + (ACCESS_TOKEN_LIFETIME),
  })

  ctx.body = {
    accessToken,
  }
}

module.exports = refreshToken
