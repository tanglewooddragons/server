const {
  deleteUserById,
} = require('db/user')
const {
  removeAllTokens,
} = require('db/token')

const deleteUser = async (ctx) => {
  const id = ctx.state.user.id

  const deleted = await deleteUserById(id)
  await removeAllTokens(id)

  if (!deleted) {
    ctx.throw(400, ctx.i18n.__('user.error.remove'))
  }

  ctx.body = deleted
}

module.exports = deleteUser
