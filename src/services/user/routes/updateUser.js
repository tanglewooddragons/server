const {
  updateUserProfileById,
} = require('db/user')
const validate = require('services/validation')
const log = require('util/log')

const updateUser = async (ctx) => {
  const id = ctx.state.user.id
  const updateData = ctx.request.body

  try {
    await validate(updateData, 'updateUser')
  } catch (validationError) {
    log.error({
      action: 'update-user',
      status: 'failed',
      error: validationError,
      data: {
        userId: id,
        update: updateData,
      },
    })
    ctx.throw(422, validationError)
  }

  const update = await updateUserProfileById(id, updateData)

  if (!update) {
    ctx.throw(400, ctx.i18n.__('user.error.update'))
    return
  }

  ctx.body = update
}

module.exports = updateUser
