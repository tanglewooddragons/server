module.exports = (User, Dragon) => async (ctx) => {
  const id = ctx.params.id

  const user = await User.findById(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Dragon, as: 'dragons' }]
  })

  if (user) {
    return ctx.body = user
  }

  return ctx.body = 'User not found'
}