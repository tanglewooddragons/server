const jwt = require('jsonwebtoken')
const { login } = require('../services/users-service')
const {
  getToken,
  saveToken,
  removeToken
} = require('../redis/token')

const loginUser = async (ctx) => {
  const body = ctx.request.body
  const response = await login(body)

  if (response.error) {
    ctx.throw(response.statusCode, response.error)
  }

  if (await getToken(response.id)) {
    await removeToken(response.id)
  }

  const token = jwt.sign(
    response,
    process.env.JWT_SECRET,
    {
      expiresIn: Date.now() + 60*60*24
    }
  )

  await saveToken(response.id, {
    token,
    exp: Date.now() + 60*60*24
  })

  ctx.body = {
    ...response,
    token
  }

  return ctx
}

module.exports = loginUser
