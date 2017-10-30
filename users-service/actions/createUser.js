const User = require('../db/User')
const validate = require('../models')
const hash = require('../utils/hash')

module.exports = async (ctx) => {
  const user = ctx.request.body

  try {
    await validate(user, 'user')
  } catch (e) { 
    ctx.throw(400, e.message)
    return
  }

  return User
    .findOrCreate({
      where: {
        email: user.email
      },
      defaults: user
    })
    .spread((user, created) => {
      if (!created) { 
        ctx.throw(409, 'Email is already taken!')
        return
      }
      
      const response = user.toJSON()
      delete response.password

      ctx.status = 201
      ctx.body = response
      return ctx
    })
}
