const { login } = require('../services/users-service')

const loginUser = async (ctx) => {
  const body = ctx.request.body
  const response = await login(body)
  ctx.body = response
  return ctx
}

module.exports = loginUser
