const {
  getDragonById,
} = require('db/dragon')

module.exports = async (ctx) => {
  const id = ctx.params.id

  const dragon = await getDragonById(id)

  if (!dragon) {
    ctx.throw(400, ctx.i18n.__('dragon.error.not_found'))
    return ctx
  }

  ctx.body = dragon
  return ctx
}
