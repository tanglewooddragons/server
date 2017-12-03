const Token = require('./models/token')
const log = require('../util/log')

async function getToken(userId) {
  try {
    const token = await Token.filter({ userId }).limit(1).run()
    return token[0]
  } catch (err) {
    log.error(`Error getting token: ${err}`)
    return null
  }
}

async function saveToken(context) {
  try {
    const token = new Token(context)
    await token.save()
    return token
  } catch (err) {
    log.error(`Error saving token: ${err}`)
    return null
  }
}

async function removeToken(userId) {
  try {
    const tokenEntries = await Token.filter({ userId }).run()

    if (!tokenEntries.length) return
    await tokenEntries.forEach(async t => t.delete())
  } catch (err) {
    log.error(`Error removing token: ${err}`)
  }
}

module.exports = {
  getToken,
  saveToken,
  removeToken,
}
