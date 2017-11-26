const Token = require('./models/token')
const log = require('../util/log')

async function getToken(userId) {
  const token = await Token.filter({ userId }).run()
  if (!token[0]) return null
  return token[0]
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

async function removeToken(token) {
  const tokenEntry = Token.filter({ token }).run()
  if (!tokenEntry[0]) return

  await tokenEntry[0].delete()
}

module.exports = {
  getToken,
  saveToken,
  removeToken
}