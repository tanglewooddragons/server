module.exports = (Dragon) => async (ctx) => {
  const id = ctx.params.id
  const update = ctx.request.body

  if (!update) {
    return ctx
  }

  return Dragon
    .update(update, {
      where: {
        id
      },
      fields: [ 'name', 'description', 'bgImage'],
      returning: true,
      plain: true,
    })
    .then((updated) => {
      ctx.status = 200
      ctx.body = updated
      return ctx
    })
    .catch((e) => {
      ctx.status = 400
      ctx.body = 'Error updating dragon!'
      return ctx
    })
}