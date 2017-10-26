const validate = require('../models')
const hash = require('../utils/hash')

module.exports = (User) => async (ctx) => {
  const body = ctx.request.body

  try {
    await validate(body, 'user')
  } catch (e) { 
    ctx.throw(400, e.message)
    return
  }

  const password = await hash(body.password)
  const user = {
    ...body,
    password
  }

  return User
    .findOrCreate({
      where: {
        email: body.email
      },
      defaults: user
    })
    .spread((user, created) => {
      if (!created) { 
        ctx.throw(409, 'Email is already taken!')
        return
      }

      ctx.status = 201
      ctx.body = user
      return ctx
    })
    .catch((err) => {    
      ctx.throw(400, 'Error creating user')
    })
}
