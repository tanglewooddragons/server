const dragonSchema = joi => ({
  name: joi.string().min(3).max(36).required(),
})

module.exports = dragonSchema
