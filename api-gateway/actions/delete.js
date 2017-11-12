const { deleteUser } = require('../services/users-service')
const log = require('../util/logger')

const deleteAccount = async (ctx) => {
  const response = await deleteUser({ id: ctx.params.id, user: ctx.state.user })
  ctx.body = response
  return ctx
}

module.exports = deleteAccount
