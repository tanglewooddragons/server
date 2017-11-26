const User = require('../db/User')

const deleteUser = async (ctx) => {
  const id = ctx.params.id || ctx.request.body.id

  if (id !== ctx.request.body.id) {
    ctx.throw(401, 'You can only remove your own account!')
    return
  }

  try {
    const deleted = await User.destroy({
      where: {
        id
      }
    })

    if (!deleted) {
      ctx.throw(400, 'Error removing user')
    }

    ctx.body = deleted
    return ctx
  } catch (e) {
    ctx.throw(400, 'Error removing user')
    return
  }
}

module.exports = deleteUser
