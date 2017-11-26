const bcrypt = require('bcryptjs')

const comparePasswords = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, isMatching) => {
      if (err) reject(err)

      resolve(isMatching)
    })
  })
}

module.exports = comparePasswords