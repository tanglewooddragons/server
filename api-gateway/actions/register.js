const { createUser } = require('../services/users-service')

const registerUser = async (ctx) => {
  const body = ctx.request.body 
  const response = await createUser(body)
  ctx.body = response
  return ctx
}

module.exports = registerUser
