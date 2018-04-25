const dragonSchema = joi => ({
  to: joi.string().required(),
  topic: joi.string().required(),
  text: joi.string().required(),
})

module.exports = dragonSchema
