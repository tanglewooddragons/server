const thinky = require('../thinky')
const Dragon = require('./dragon')
const LoginInfo = require('./loginInfo')
const UserProfile = require('./userProfile')

const User = thinky.createModel('User', {
  registrationDate: thinky.type.date().default(thinky.r.now()),
  username: thinky.type
    .string()
    .min(3)
    .max(24)
    .required(),
  confirmed: thinky.type.boolean().default(false),
  premium: thinky.type.boolean().default(false),
  role: thinky.type.string().default('user'),
  silver: thinky.type.number().default(0),
  sapphires: thinky.type.number().default(0),
  inventory: {
    ingredients: thinky.type.object().default({}),
    items: thinky.type.array().default([]),
  },
})

User.hasOne(LoginInfo, 'login', 'id', 'userId')
User.hasOne(UserProfile, 'profile', 'id', 'userId')
User.hasMany(Dragon, 'dragons', 'id', 'owner')

module.exports = User
