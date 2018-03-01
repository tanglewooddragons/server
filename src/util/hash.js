const argon2 = require('argon2')

const hash = async password => argon2.hash(password)

module.exports = hash
