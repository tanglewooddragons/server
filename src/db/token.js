const Token = require('./models/token')
const log = require('../util/log')

async function getTokens(userId) {
  try {
    log.debug(`Getting tokens for ${userId}..`)
    const tokens = await Token.filter({ userId }).run()
    log.debug(`Got tokens for ${userId}`)
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

module.exports = {
  getTokens,
  saveToken,
  removeToken,
  removeAllTokens,
}
