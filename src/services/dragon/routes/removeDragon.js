const {
  removeDragonById,
} = require('db/dragon')

const removeDragon = async (ctx) => {
  const id = ctx.params.id

  const deleted = await removeDragonById(id)

  if (!deleted) {
    ctx.throw(400, ctx.i18n.__('REMOVING_DRAGON_ERROR'))
  }

  ctx.body = deleted
}

module.exports = removeDragon
