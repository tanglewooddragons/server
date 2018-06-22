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
  termsOfService: {
    accepted: thinky.type.boolean().default(false),
    acceptDate: thinky.type.date(),
  },
  role: thinky.type.string().default('user'),
  silver: thinky.type.number().default(0),
  sapphires: thinky.type.number().default(0),
  inventory: thinky.type.array().schema({
    id: thinky.type.string().required(),
    amount: thinky.type.number().default(1),
  }).default([]),
})

User.hasOne(LoginInfo, 'login', 'id', 'userId')
User.hasOne(UserProfile, 'profile', 'id', 'userId')
User.hasMany(Dragon, 'dragons', 'id', 'owner')

module.exports = User
