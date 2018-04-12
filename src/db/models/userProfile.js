const thinky = require('../thinky')

const UserProfile = thinky.createModel('UserProfile', {
  userId: thinky.type.string().required(),
  avatar: thinky.type.string(),
  backgroundPicture: thinky.type.string(),
  country: thinky.type.string(),
  dateOfBirth: thinky.type.date(),
  bio: thinky.type.string(),
})

module.exports = UserProfile
