const {
  deleteUserById,
} = require('db/user')
const {
  removeToken,
} = require('db/token')

const deleteUser = async (ctx) => {
  const id = ctx.state.user.id

  const deleted = await deleteUserById(id)
  await removeToken(id)

  if (!deleted) {
    ctx.throw(400, ctx.i18n.__('REMOVING_USER_ERROR'))
  }

  ctx.body = deleted
}

module.exports = deleteUser
