const User = require('./models/user')
const log = require('../util/log')

async function emailTaken(email) {
  const user = await User.filter({ email }).run()
  return user.length > 0
}

async function createUser(options) {
  try {
    const user = new User(options)
    await user.save()
    return user
  } catch (err) {
    log.error(`Error creating user: ${err}`)
    return null
  }
}

async function getUserByEmail(email) {
  try {
    const users = await User.filter({ email }).limit(1).run()
    const user = users[0]

    if (!user) return null
    return user
  } catch (err) {
    log.error(`Error fetching user: ${err}`)
    return null
  }
}

module.exports = {
  emailTaken,
  createUser,
  getUserByEmail
}