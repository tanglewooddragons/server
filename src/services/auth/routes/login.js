const jwt = require('jsonwebtoken')
const { saveToken } = require('db/token')
const {
  getLoginInfo,
  getUserById,
} = require('db/user')
const comparePasswords = require('util/comparePasswords')

const {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} = require('constants/auth')

const login = async (ctx) => {
  const { email, password } = ctx.request.body

  const loginInfo = await getLoginInfo(email)

  if (!loginInfo) {
    ctx.throw(400, ctx.i18n.__('WRONG_EMAIL'))
  }

  const isPasswordCorrect = await comparePasswords(password, loginInfo.password)

  if (!isPasswordCorrect) {
    ctx.throw(401, ctx.i18n.__('WRONG_PASSWORD'))
    return
  }

  const user = await getUserById(loginInfo.userId)

  const tokenBody = {
    id: user.id,
    role: user.role,
  }

  const accessToken = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: Date.now() + (ACCESS_TOKEN_LIFETIME),
  })

  const refreshToken = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: Date.now() + (REFRESH_TOKEN_LIFETIME),
  })

  await saveToken({
    userId: user.id,
    refreshToken,
  })

  ctx.body = {
    ...user,
    accessToken,
    refreshToken,
  }
}

module.exports = login
