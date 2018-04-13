const User = require('./models/user')
const LoginInfo = require('./models/loginInfo')
const UserProfile = require('./models/userProfile')
const log = require('../util/log')

async function emailTaken(email) {
  log.debug(email, 'Checking if email is available')
  const emails = await LoginInfo.filter({ email }).run()
  return emails.length > 0
}

async function getLoginInfo(email) {
  try {
    log.debug(`Fetching user login info by email: ${email}`)
    const users = await LoginInfo.filter({ email }).limit(1).run()
    const user = users[0]

    if (!user) return null
    return user
  } catch (err) {
    log.error(`Error fetching user login info: ${err}`)
    return null
  }
}

async function createUser(options) {
  try {
    log.debug(`Creating new user: ${options.username}`)
    const user = new User({
      username: options.username,
    })
    await user.save()

    const loginInfo = new LoginInfo({
      email: options.email,
      password: options.password,
      userId: user.id,
    })
    await loginInfo.save()

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
    const userProfile = await UserProfile.filter({ userId: id }).run()
    await userProfile[0].delete()
    log.debug(`User ${id} has been removed`)
    return true
  } catch (err) {
    log.error(`Error deleting user: ${err}`)
    return null
  }
}

module.exports = {
  emailTaken,
  getLoginInfo,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
}
