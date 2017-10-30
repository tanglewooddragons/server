const User = require('../db/User')
const comparePasswords = require('../utils/comparePasswords')

const loginUser = async (ctx) => {
  const {
    email,
    password
  } = ctx.request.body
 
  const user = await User.find({
    where: {
      email
    },
    raw: true
  })

  if (!user) {
    ctx.throw(400, 'Wrong email')
    return
  }

  const isPasswordCorrect = await comparePasswords(password, user.password)

  if (!isPasswordCorrect) {
    ctx.throw(401, 'Wrong password')
    return
  }
  
  const data = {
    id: user.id,
    email: user.email,
    role: user.role
  }

  ctx.body = data
  return ctx
}

module.exports = loginUser
