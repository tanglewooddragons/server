const thinky = require('../thinky')

const Token = thinky.createModel('Token', {
  userId: thinky.type.string().required(),
  token: thinky.type.string().required(),
  expires: thinky.type.date().required(),
})

module.exports = Token
