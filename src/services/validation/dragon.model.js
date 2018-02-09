const dragonSchema = joi => ({
  name: joi.string().min(3).max(36).required(),
  aspect: joi.string().required(),
})

module.exports = dragonSchema
