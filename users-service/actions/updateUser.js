const hash = require('../utils/hash')

module.exports = (User) => async (ctx) => {
  const id = ctx.params.id
  const update = ctx.request.body

  if (!update) {
    return ctx
  }

  if (update.password) {
    const password = hash(body.password)

    update = {
      ...update,
      password
    }
  }

  return User.update(update, {
    where: {
      id
    },
    fields: [ 'username', 'password', 'avatar', 'backgroundPicture', 'country', 'dataOfBirth', 'bio' ],
    returning: true,
    raw: true
  })
    .then((updated) => {
      // updated is an array -> [affectedRows, [updatedUser]]
      ctx.body = updated[1][0]
      return ctx
    })
    .catch((e) => {
      ctx.throw(400, 'Error updating user')
      return ctx
    })
}
