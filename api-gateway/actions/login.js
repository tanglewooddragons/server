const jwt = require('jsonwebtoken')
const { login } = require('../services/users-service')

const loginUser = async (ctx) => {
  const body = ctx.request.body
  const response = await login(body)

  if (response.error) {
    ctx.body = response
    return ctx
  }

  const token = jwt.sign(
    response,
    process.env.JWT_SECRET,
    {
      expiresIn: '24h'
    }
  )

  ctx.body = {
    ...response,
    token
  }

  return ctx
}

module.exports = loginUser
