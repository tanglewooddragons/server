const User = require('../db/User')

const deleteUser = async (ctx) => {
  const id = ctx.params.id

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