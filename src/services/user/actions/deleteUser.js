const {
  deleteUserById,
} = require('../../../db/user')

const deleteUser = async (ctx) => {
  const id = ctx.state.user.id

  const deleted = await deleteUserById(id)

  if (!deleted) {
    ctx.throw(400, 'Error deleting user')
  }
}

module.exports = deleteUser
