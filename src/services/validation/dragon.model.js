const dragonSchema = joi => ({
  name: joi.string().min(3).max(64).required(),
  aspect: joi.string().required(),
})

module.exports = dragonSchema
