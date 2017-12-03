const {
  updateUserById,
} = require('../../../db/user')

const updateUser = async (ctx) => {
  const id = ctx.state.user.id
  const updateData = ctx.request.body

  // @TODO Require some sort of confirmation maybe password?
  // @TODO validate provided data
  // @TODO hash password
  const update = await updateUserById(id, updateData)

  if (!update) {
    ctx.throw(400, 'Error updating user')
    return
  }

  delete update.password
  ctx.body = update
}

module.exports = updateUser
