module.exports = (Dragon) => async (ctx) => {
  const id = ctx.params.id

  const dragon = await Dragon.findById(id)

  if (dragon) {
    ctx.body = dragon
    return ctx
  }

  ctx.status = 400
  ctx.body = 'Dragon not found'
  return ctx
}