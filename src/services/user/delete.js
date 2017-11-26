const { deleteUser } = require('../services/users-service')

const deleteAccount = async (ctx) => {
  const id = ctx.params.id || ctx.state.user.id
  const response = await deleteUser({ id, user: ctx.state.user })
  ctx.body = response
  return ctx
}

module.exports = deleteAccount
