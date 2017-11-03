const log = require('../util/logger')

const logger = async (ctx, next) => {
  const format = '[:method] :url [:id]'

  const str = format
    .replace(':method', ctx.method)
    .replace(':url', ctx.url)
    .replace(':id', ctx.state.id)

  log.info(str)

  await next()
}

module.exports = logger