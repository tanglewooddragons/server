const updateUserSchema = joi => ({
  username: joi.string().min(3).max(48).optional(),
  email: joi.string().email().optional(),
  password: joi.string().min(3).optional(),
  passwordRepeat: joi.string().min(3).optional(),
  profile: joi.object().keys({
    avatar: joi.string().optional(),
    backgroundPicture: joi.string().optional(),
    country: joi.string().optional(),
    dateOfBirth: joi.date().optional(),
    bio: joi.string().optional(),
  }),
})

module.exports = updateUserSchema
