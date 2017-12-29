const bcrypt = require('bcryptjs')

const hash = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) reject(saltErr)

      bcrypt.hash(password, salt, (passErr, hashed) => {
        if (passErr) reject(passErr)
        resolve(hashed)
      })
    })
  })

module.exports = hash
