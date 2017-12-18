const {
  removeDragonById,
} = require('../../../db/dragon')

const removeDragon = async (ctx) => {
  const id = ctx.params.id

  const deleted = await removeDragonById(id)

  if (!deleted) {
    ctx.throw(400, 'Error deleting dragon')
  }

  ctx.body = deleted
}

module.exports = removeDragon
