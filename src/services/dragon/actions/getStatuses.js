const {
  getUserDragonsStatuses,
} = require('db/dragonStatus')

module.exports = async (ctx) => {
  const userId = ctx.state.user.id
  const statuses = await getUserDragonsStatuses(userId)

  ctx.body = statuses
  return ctx
}
