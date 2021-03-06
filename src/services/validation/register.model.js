const registerSchema = joi => ({
  username: joi.string().min(3).max(48).required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
  passwordRepeat: joi.string().min(3).required(),
})

module.exports = registerSchema
