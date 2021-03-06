const {
  updateDragon,
} = require('db/dragon')

module.exports = async (ctx) => {
  const id = ctx.params.id
  const update = ctx.request.body

  const valid = [
    'name',
    'description',
    'bgImage',
  ]

  const cleanedUpdate = valid.reduce((acc, prop) => {
    if (update[prop]) acc[prop] = update[prop]
    return acc
  }, {})

  if (!update) {
    ctx.throw(400, ctx.i18n.__('dragon.error.no_update_body'))
  }

  const updated = await updateDragon(id, cleanedUpdate)
  ctx.body = updated
}
