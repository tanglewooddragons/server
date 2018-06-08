const log = require('util/log')

const Token = require('./models/token')

async function getToken(token) {
  try {
    const tokens = await Token.filter({ token }).run()
    return tokens
  } catch (error) {
    log.error({
      action: 'get-token',
      status: 'failed',
      error,
    })

    return null
  }
}

async function saveToken(context) {
  try {
    const token = new Token(context)
    await token.save()
    return token
  } catch (error) {
    log.error({
      action: 'save-token',
      status: 'failed',
      error,
    })

    return null
  }
}

async function removeToken(token) {
  try {
    const tokenEntry = await Token.filter({ token }).run()
    await tokenEntry[0].delete()
    return true
  } catch (error) {
    log.error({
      action: 'remove-token',
      status: 'failed',
      error,
    })

    return null
  }
}

async function removeAllTokens(userId) {
  try {
    const tokenEntries = await Token.filter({ userId }).run()

    if (!tokenEntries.length) return true
    await tokenEntries.forEach(async t => t.delete())
    return true
  } catch (error) {
    log.error({
      action: 'remove-all-tokens',
      status: 'failed',
      error,
    })

    return null
  }
}

async function removeExpiredTokens() {
  log.info({
    action: 'remove-expired-tokens',
    status: 'pending',
  })

  try {
    const expiredTokens = await Token
      .filter(token => token.expires >= Date.now())
      .run()

    if (!expiredTokens) return true

    expiredTokens.forEach(expiredToken => expiredToken.delete())

    log.info({
      action: 'remove-expired-tokens',
      status: 'success',
    })

    return true
  } catch (error) {
    log.error({
      action: 'remove-expired-tokens',
      status: 'failed',
      error,
    })

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
