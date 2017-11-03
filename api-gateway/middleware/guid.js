const uuid = require('uuid/v4')

const guid = async (ctx, next) => {
  const id = uuid()

  ctx.id = id
  ctx.request.id = id
  ctx.state.id = id
  ctx.set('X-Request-Id', id)

  await next()
}

module.exports = guid