const jwt = require('jsonwebtoken')

const { saveToken } = require('db/token')
const {
  getLoginInfo,
  getUserById,
} = require('db/user')
const comparePasswords = require('util/comparePasswords')
const log = require('util/log')

const {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} = require('constants/auth')

const login = async (ctx) => {
  const { email, password } = ctx.request.body

  const loginInfo = await getLoginInfo(email)

  if (!loginInfo) {
    ctx.throw(400, ctx.i18n.__('auth.error.wrong_email'))
    log.error({
      action: 'login',
      status: 'failed',
      error: 'Invalid email address',
      data: {
        email,
      },
    })
    return
  }

  const isPasswordCorrect = await comparePasswords(password, loginInfo.password)

  if (!isPasswordCorrect) {
    ctx.throw(401, ctx.i18n.__('auth.error.wrong_password'))
    log.error({
      action: 'login',
      status: 'failed',
      error: 'Incorrect password',
      data: {
        email,
      },
    })
    return
  }

  // Do not log in banned user
  if (loginInfo.isBanned) {
    // @TODO Add ban lift date to data sent to user
    ctx.throw(403, ctx.i18n.__('auth.error.banned'))
    log.error({
      action: 'login',
      status: 'failed',
      error: 'User is banned',
      data: {
        email,
      },
    })
    return
  }

  const user = await getUserById(loginInfo.userId)

  const locale = ctx.getLocaleFromHeader() || 'en'

  const tokenBody = {
    id: user.id,
    role: user.role,
    locale,
    email: loginInfo.email,
  }

  const accessToken = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFETIME,
  })

  const refreshToken = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_LIFETIME,
  })

  const expires = Date.now() + REFRESH_TOKEN_LIFETIME

  await saveToken({
    userId: user.id,
    token: refreshToken,
    expires,
  })

  ctx.body = {
    ...user,
    accessToken,
    refreshToken,
  }
}

module.exports = login
