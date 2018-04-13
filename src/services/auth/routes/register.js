const { emailTaken, createUser } = require('db/user')
const hash = require('util/hash')
const log = require('util/log')
const validate = require('services/validation')

const register = async (ctx) => {
  const data = ctx.request.body

  try {
    await validate(data, 'register')
  } catch (err) {
    // @TODO Possibly add the result of validation to error
    ctx.throw(422, ctx.i18n.__('REGISTER_VALIDATION_ERROR'))
  }

  const exists = await emailTaken(data.email)
  if (exists) {
    ctx.throw(403, ctx.i18n.__('EMAIL_TAKEN'))
    return
  }

  if (data.password !== data.passwordRepeat) {
    ctx.throw(400, ctx.i18n.__('PASSWORD_MISMATCH'))
    return
  }

  const hashedPassword = await hash(data.password)

  const user = {
    email: data.email,
    password: hashedPassword,
    username: data.username,
  }

  await createUser(user)
    .then((newUser) => {
      ctx.status = 201
      ctx.body = newUser
    })
    .catch((err) => {
      log.error(err)
      ctx.throw(400, ctx.i18n.__('ERROR_CREATING_USER'))
    })
}

module.exports = register
