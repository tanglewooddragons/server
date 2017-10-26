module.exports = (Dragon) => async (ctx) => {
  const ownerId = ctx.params.id

  const dragons = await Dragon
    .findAll({
      where: {
        ownerId: ownerId
      },
      raw: true
    })

  if (!dragons) {
    ctx.body = []
    return ctx
  }

  ctx.body = dragons
  return ctx
}
