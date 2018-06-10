const User = require('./models/user')
const LoginInfo = require('./models/loginInfo')
const UserProfile = require('./models/userProfile')
const log = require('../util/log')

async function emailTaken(email) {
  const emails = await LoginInfo.filter({ email }).run()
  return emails.length > 0
}

async function getLoginInfo(email) {
  try {
    const users = await LoginInfo.filter({ email }).limit(1).run()
    const user = users[0]

    if (!user) return null
    return user
  } catch (error) {
    log.error({
      action: 'get-login-info',
      status: 'failed',
      error,
      data: {
        email,
      },
    })

    return null
  }
}

async function createUser(options) {
  try {
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

    return user
  } catch (error) {
    // Remove password from logs
    options.password = undefined

    log.error({
      action: 'create-user',
      status: 'failed',
      error,
      data: {
        options,
      },
    })

    return null
  }
}

async function getUserById(id) {
  try {
    const user = await User
      .get(id)
      .getJoin({
        dragons: true,
        profile: true,
      })
      .run()

    if (!user) return null
    return user
  } catch (error) {
    log.error({
      action: 'get-user-by-id',
      status: 'failed',
      error,
      data: {
        id,
      },
    })

    return null
  }
}

async function updateUserById(userId, update) {
  try {
    const entry = await User.filter({ userId }).run()
    const user = entry[0]
    await user.merge(update)
    await user.save()

    return user
  } catch (error) {
    log.error({
      action: 'update-user-by-id',
      status: 'failed',
      error,
      data: {
        userId,
        update,
      },
    })

    return null
  }
}

async function updateUserProfileById(userId, update) {
  try {
    const entry = await UserProfile.filter({ userId }).run()
    /*
     * Filter returns an array but it always
     * should be just one entry
     */
    const profile = entry[0]
    await profile.merge(update)
    await profile.save()
    return profile
  } catch (error) {
    log.error({
      action: 'update-user-profile-by-id',
      status: 'failed',
      error,
      data: {
        userId,
        update,
      },
    })

    return null
  }
}

async function deleteUserById(id) {
  try {
    log.info({
      action: 'delete-user-by-id',
      status: 'pending',
      data: {
        id,
      },
    })

    const user = await User.get(id).run()
    await user.delete()
    const userProfile = await UserProfile.filter({ userId: id }).run()
    await userProfile[0].delete()
    const loginInfo = await LoginInfo.filter({ userId: id }).run()
    await loginInfo[0].delete()

    log.info({
      action: 'delete-user-by-id',
      status: 'success',
      data: {
        id,
      },
    })

    return true
  } catch (error) {
    log.error({
      action: 'delete-user-by-id',
      status: 'failed',
      error,
      data: {
        id,
      },
    })

    return null
  }
}

async function markToSAsAccepted(userId) {
  const update = {
    termsOfService: {
      accepted: true,
      acceptDate: new Date(),
    },
  }

  try {
    const user = await getUserById(userId)
    await user.merge(update)
    await user.save()

    log.info({
      action: 'mark-tos-as-accepted',
      status: 'success',
      data: {
        userId,
      },
    })

    return user
  } catch (error) {
    log.error({
      action: 'mark-tos-as-accepted',
      status: 'failed',
      error,
      data: {
        userId,
      },
    })

    return null
  }
}

module.exports = {
  emailTaken,
  getLoginInfo,
  createUser,
  getUserById,
  updateUserById,
  updateUserProfileById,
  deleteUserById,
  markToSAsAccepted,
}
