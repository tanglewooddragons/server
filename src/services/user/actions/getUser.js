const {
  getUserById,
} = require('db/user')

const getUser = async (ctx) => {
  const id = (ctx.params.id) ? ctx.params.id : ctx.state.user.id
  const user = await getUserById(id)

  if (!user) {
    ctx.throw(400, ctx.i18n.__('USER_NOT_FOUND'))
  }

  delete user.password
  ctx.body = user
}

module.exports = getUser
