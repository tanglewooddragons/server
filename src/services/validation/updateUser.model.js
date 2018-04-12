const updateUserSchema = joi => ({
  avatar: joi.string().optional(),
  backgroundPicture: joi.string().optional(),
  country: joi.string().optional(),
  dateOfBirth: joi.date().optional(),
  bio: joi.string().optional(),
})

module.exports = updateUserSchema
