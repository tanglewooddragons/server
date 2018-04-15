const Token = require('./models/token')
const log = require('../util/log')

async function getToken(token) {
  try {
    log.debug(`Getting token ${token}..`)
    const tokens = await Token.filter({ token }).run()
    log.debug(`Got token ${token}`)
    return tokens
  } catch (err) {
    log.error(`Error getting tokens: ${err}`)
    return null
  }
}

async function saveToken(context) {
  try {
    log.debug(`Saving token for ${context.userId}`)
    const token = new Token(context)
    await token.save()
    log.debug(`Token saved for ${context.userId}`)
    return token
  } catch (err) {
    log.error(`Error saving token: ${err}`)
    return null
  }
}

async function removeToken(token) {
  try {
    log.debug(`Removing token: ${token}`)
    const tokenEntry = await Token.filter({ token }).run()
    await tokenEntry[0].delete()
    return true
  } catch (err) {
    log.error(`Error removing token: ${err}`)
    return null
  }
}

async function removeAllTokens(userId) {
  try {
    log.debug(`Removing all tokens for ${userId}`)
    const tokenEntries = await Token.filter({ userId }).run()

    if (!tokenEntries.length) return true
    await tokenEntries.forEach(async t => t.delete())
    return true
  } catch (err) {
    log.error(`Error removing tokens: ${err}`)
    return null
  }
}

async function removeExpiredTokens() {
  try {
    log.debug('Removing expired tokens..')
    const expiredTokens = await Token
      .filter(token => token.expires >= Date.now())
      .run()

    if (!expiredTokens) return true

    expiredTokens.forEach(expiredToken => expiredToken.delete())
    return true
  } catch (err) {
    log.error(`Error removing expired tokens: ${err}`)
    return null
  }
}

module.exports = {
  getToken,
  saveToken,
  removeToken,
  removeAllTokens,
  removeExpiredTokens,
}
