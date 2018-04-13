const thinky = require('../thinky')

const LoginInfo = thinky.createModel('loginInfo', {
  userId: thinky.type.string().required(),
  email: thinky.type
    .string()
    .email()
    .required(),
  password: thinky.type
    .string()
    .min(3)
    .required(),
  lastLogin: thinky.type.date().default(thinky.r.now()),
  bannedUntil: thinky.type.date(),
  isBanned: thinky.type.virtual().default(function () {
    if (!this.bannedUntil) return false
    return Date.parse(this.bannedUntil) > Date.now()
  }),
})

module.exports = LoginInfo
