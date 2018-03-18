const jwt = require('jsonwebtoken')
const { getToken, saveToken, removeToken } = require('db/token')
const { getUserByEmail } = require('db/user')
const comparePasswords = require('util/comparePasswords')

const login = async (ctx) => {
  const { email, password } = ctx.request.body

  const user = await getUserByEmail(email)

  if (!user) {
    ctx.throw(400, ctx.i18n.__('WRONG_EMAIL'))
  }

  const isPasswordCorrect = await comparePasswords(password, user.password)

  if (!isPasswordCorrect) {
    ctx.throw(401, ctx.i18n.__('WRONG_PASSWORD'))
    return
  }

  const oldToken = await getToken(user.id)
  if (oldToken) {
    await removeToken(user.id)
  }

  const tokenBody = {
    id: user.id,
    role: user.role,
  }

  const token = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: Date.now() + (60 * 60 * 24),
  })

  await saveToken({
    userId: user.id,
    token,
  })

  delete user.password

  ctx.body = {
    ...user,
    token,
  }
}

module.exports = login
