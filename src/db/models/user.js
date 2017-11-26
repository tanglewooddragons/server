const thinky = require('../thinky')
const Dragon = require('./dragon')

const User = thinky.createModel('User', {
  email: thinky.type
    .string()
    .email()
    .required(),
  password: thinky.type.string().required(),
  registrationDate: thinky.type.date().default(thinky.r.now()),
  username: thinky.type
    .string()
    .min(3)
    .max(24),
  profile: {
    avatar: thinky.type.string(),
    backgroundPicture: thinky.type.string(),
    country: thinky.type.string(),
    dateOfBirth: thinky.type.date(),
    bio: thinky.type.string()
  },
  confirmed: thinky.type.boolean().default(false),
  premium: thinky.type.boolean().default(false),
  role: thinky.type.string().default('user'),
  silver: thinky.type.number().default(0),
  sapphires: thinky.type.number().default(0),
  inventory: thinky.type
    .object()
    .schema({
      ingredients: thinky.type.object(),
      items: thinky.type.object()
    })
    .default({ ingredients: {}, items: {} })
})

User.hasMany(Dragon, 'dragons', 'id', 'owner')

module.exports = User
