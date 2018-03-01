const argon2 = require('argon2')

const comparePasswords = async (password, hash) => {
  try {
    const isMatching = await argon2.verify(hash, password)
    return isMatching
  } catch (err) {
    return null
  }
}

module.exports = comparePasswords
