const koaJwt = require('koa-jwt')

const jwt = koaJwt({
  secret: process.env.JWT_SECRET
})

module.exports = jwt
