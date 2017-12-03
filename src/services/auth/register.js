const { emailTaken, createUser } = require('../../db/user')
const hash = require('../../util/hash')
const log = require('../../util/log')
const validate = require('../../validation')

const register = async (ctx) => {
  const data = ctx.request.body

  const exists = await emailTaken(data.email)
  if (exists) {
    ctx.throw(403, 'Email is already taken')
    return
  }

  if (data.password !== data.passwordRepeat) {
    ctx.throw(400, 'Passwords do not match')
    return
  }

  try {
    await validate(data, 'user')
  } catch (err) {
    // @TODO Dać tu jakiś normalny error
    ctx.throw(400, err)
  }

  const hashedPassword = await hash(data.password)

  const user = {
    email: data.email,
    password: hashedPassword,
    username: data.username,
  }

  await createUser(user)
    .then((newUser) => {
      // eslint-disable-next-line
      delete newUser.password
      ctx.status = 201
      ctx.body = newUser
      log.debug(`Created new user: ${newUser.username}`)
    })
    .catch((err) => {
      log.error(err)
      ctx.throw(400, 'Error creating user')
    })
}

module.exports = register