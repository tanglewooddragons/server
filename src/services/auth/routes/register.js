const { emailTaken, createUser } = require('db/user')
const hash = require('util/hash')
const log = require('util/log')
const validate = require('services/validation')

const register = async (ctx) => {
  const data = ctx.request.body

  try {
    await validate(data, 'register')
  } catch (error) {
    data.password = undefined
    data.passwordRepeat = undefined

    log.error({
      action: 'register',
      status: 'failed',
      error,
      data,
    })

    // @TODO Possibly add the result of validation to error
    ctx.throw(422, ctx.i18n.__('auth.error.register_validation'))
  }

  const exists = await emailTaken(data.email)
  if (exists) {
    ctx.throw(403, ctx.i18n.__('auth.error.email_taken'))
    return
  }

  if (data.password !== data.passwordRepeat) {
    ctx.throw(400, ctx.i18n.__('auth.error.password_mismatch'))
    return
  }

  const hashedPassword = await hash(data.password)

  const user = {
    email: data.email,
    password: hashedPassword,
    username: data.username,
  }

  const newUser = await createUser(user)

  if (!newUser) {
    ctx.throw(400, ctx.i18n.__('auth.error.create_user'))
    return
  }

  ctx.status = 201
  ctx.body = newUser
}

module.exports = register
