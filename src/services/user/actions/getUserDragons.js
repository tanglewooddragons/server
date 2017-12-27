const {
  getUserDragonsById,
} = require('../../../db/user')

const getUserDragons = async (ctx) => {
  const id = (ctx.params.id) ? ctx.params.id : ctx.state.user.id
  const dragons = await getUserDragonsById(id)

  if (!dragons) {
    ctx.throw(400, 'Dragons not found')
  }

  ctx.body = dragons
}

module.exports = getUserDragons
