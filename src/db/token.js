const Token = require('./models/token')
const log = require('../util/log')

async function getToken(userId) {
  try {
    log.debug(`Getting token for ${userId}..`)
    const token = await Token.filter({ userId }).limit(1).run()
    log.debug(`Get token for ${userId}`)
    return token[0]
  } catch (err) {
    log.error(`Error getting token: ${err}`)
    return null
  }
}

async function saveToken(context) {
  try {
    log.debug(context, 'Saving token')
    const token = new Token(context)
    await token.save()
    log.debug(token, 'Token saved')
    return token
  } catch (err) {
    log.error(`Error saving token: ${err}`)
    return null
  }
}

async function removeToken(userId) {
  try {
    log.debug(`Removing token for ${userId}`)
    const tokenEntries = await Token.filter({ userId }).run()

    if (!tokenEntries.length) return true
    await tokenEntries.forEach(async t => t.delete())
    return true
  } catch (err) {
    log.error(`Error removing token: ${err}`)
    return null
  }
}

module.exports = {
  getToken,
  saveToken,
  removeToken,
}
