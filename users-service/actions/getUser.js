const User = require('../db/User')
const Dragon = require('../db/Dragon')

module.exports = async (ctx) => {
  const id = ctx.params.id

  const user = await User.findById(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Dragon, as: 'dragons' }],
    plain: true
  })

  if (!user) {
    ctx.throw(400, 'User not found')
    return ctx
  }

  ctx.body = user.toJSON()
  return ctx
}
