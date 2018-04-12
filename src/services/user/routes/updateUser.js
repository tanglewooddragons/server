const {
  updateUserById,
} = require('db/user')
const validate = require('services/validation')

const updateUser = async (ctx) => {
  const id = ctx.state.user.id
  const updateData = ctx.request.body

  try {
    await validate(updateData, 'updateUser')
  } catch (validationError) {
    ctx.throw(422, validationError)
  }

  const update = await updateUserById(id, updateData)

  if (!update) {
    ctx.throw(400, ctx.i18n.__('UPDATING_USER_ERROR'))
    return
  }

  ctx.body = update
}

module.exports = updateUser
