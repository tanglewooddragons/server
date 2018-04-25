const {
  getUserById,
} = require('db/user')

const getUser = async (ctx) => {
  const id = (ctx.params.id) ? ctx.params.id : ctx.state.user.id
  const user = await getUserById(id)

  if (!user) {
    ctx.throw(400, ctx.i18n.__('user.error.not_found'))
  }

  ctx.body = user
}

module.exports = getUser
