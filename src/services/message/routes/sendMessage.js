const { sendMessage } = require('db/message')
const validate = require('services/validation')
const log = require('util/log')

const send = async (ctx) => {
  try {
    await validate(ctx.request.body, 'message')
  } catch (validationError) {
    log.error({
      action: 'send-chat-message',
      status: 'failed',
      error: validationError,
      data: ctx.request.body,
    })

    ctx.throw(422, validationError)
  }

  const from = ctx.state.user.id

  const {
    to,
    topic,
    text,
  } = ctx.request.body

  const message = await sendMessage({
    from,
    to,
    topic,
    text,
  })

  if (!message) {
    ctx.throw(400, ctx.i18n.__('message.error.send'))
  }

  ctx.body = message
}

module.exports = send
