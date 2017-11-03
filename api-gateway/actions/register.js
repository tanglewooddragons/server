const { createUser } = require('../services/users-service')

const registerUser = async (ctx) => {
  const {
    username,
    email,
    password,
    passwordRepeat
  } = ctx.request.body

  if (password !== passwordRepeat) {
    ctx.throw(400, 'Passwords do not match')
    return
  }

  const response = await createUser({ username, email, password })
  ctx.body = response
  return ctx
}

module.exports = registerUser
