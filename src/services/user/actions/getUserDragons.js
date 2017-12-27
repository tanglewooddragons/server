const {
  getUserDragonsById,
} = require('../../../db/user')

const getUserDragons = async (ctx) => {
  const id = (ctx.params.id) ? ctx.params.id : ctx.state.user.id
  const dragons = await getUserDragonsById(id)

  ctx.body = dragons
}

module.exports = getUserDragons
