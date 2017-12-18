const {
  updateDragon,
} = require('../../../db/dragon')

const getUser = async (ctx) => {
  const id = ctx.params.id
  const update = ctx.request.body

  if (!update) {
    ctx.throw(400, 'No update body provided')
  }

  const updated = await updateDragon(id, update)
  ctx.body = updated
}

module.exports = getUser
