module.exports = (Dragon) => async (ctx) => {
  const ownerId = ctx.params.id

  const dragons = await Dragon
    .findAll({
      where: {
        ownerId: ownerId
      }
    })

  if (dragons) {
    return ctx.body = dragons
  }

  return ctx.body = 'Dragons not found'
}