const jwt = require('jsonwebtoken')
const {
  getToken,
} = require('../../db/token')

const auth = async (ctx, next) => {
  // Supertest sends headers lowercase
  const header = ctx.headers.Authorization || ctx.headers.authorization

  if (!header) {
    ctx.throw(401, 'Authentication error')
    return
  }

  const token = header.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const entry = await getToken(decoded.id)

  if (!entry || entry.token !== token) {
    ctx.throw(401, 'Authentication error')
    return
  }

  ctx.state.user = decoded

  await next()
}

module.exports = auth
