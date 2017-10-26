module.exports = (Dragon) => async (ctx) => {
  const id = ctx.params.id

  const dragon = await Dragon.findById(id)

  if (!dragon) {
    ctx.throw(400, 'Dragon not found')
    return ctx
  }

  ctx.body = dragon.toJSON()
  return ctx
 }
