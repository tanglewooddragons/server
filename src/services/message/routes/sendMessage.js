const { sendMessage } = require('db/message')
const validate = require('services/validation')

const send = async (ctx) => {
  try {
    await validate(ctx.request.body, 'message')
  } catch (validationError) {
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
    ctx.throw(400, 'Prombel')
  }

  ctx.body = message
}

module.exports = send
