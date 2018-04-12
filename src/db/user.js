const User = require('./models/user')
const UserProfile = require('./models/userProfile')
const log = require('../util/log')

async function emailTaken(email) {
  log.debug(email, 'Checking if email is available')
  const user = await User.filter({ email }).run()
  return user.length > 0
}

async function createUser(options) {
  try {
    log.debug(`Creating new user: ${options.username}`)
    const user = new User(options)
    await user.save()
    const profile = new UserProfile({
      userId: user.id,
    })
    await profile.save()
    log.debug(`User ${options.username} created successfully!`)
    return user
  } catch (err) {
    log.error(`Error creating user: ${err}`)
    return null
  }
}

async function getUserByEmail(email) {
  try {
    log.debug(`Fetching user by email: ${email}`)

    /*
      Fetching by email is used for login,
      so joins are not needed
    */
    const users = await User.filter({ email }).limit(1).run()
    const user = users[0]

    if (!user) return null
    return user
  } catch (err) {
    log.error(`Error fetching user: ${err}`)
    return null
  }
}

async function getUserById(id) {
  try {
    log.debug(`Getting user by id: ${id}`)
    const user = await User
      .get(id)
      .getJoin({
        dragons: true,
        profile: true,
      })
      .run()

    if (!user) return null
    return user
  } catch (err) {
    log.error(`Error fetching user: ${err}`)
    return null
  }
}

async function updateUserById(userId, update) {
  try {
    log.debug(`Updating user by id: ${userId}`)
    const entry = await UserProfile.filter({ userId }).run()
    /*
      Filter returns an array but it always
      should be just one entry
    */
    const profile = entry[0]
    await profile.merge(update)
    await profile.save()
    log.debug(profile, 'User profile updated successfully')
    return profile
  } catch (err) {
    log.error(`Error updating user profile: ${err}`)
    return null
  }
}

async function deleteUserById(id) {
  try {
    log.debug(`Deleting user: ${id}`)
    const user = await User.get(id).run()
    await user.delete()
    log.debug(`User ${id} has been removed`)
    return true
  } catch (err) {
    log.error(`Error deleting user: ${err}`)
    return null
  }
}

module.exports = {
  emailTaken,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
}
