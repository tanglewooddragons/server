const userSchema = joi => ({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
})

module.exports = userSchema