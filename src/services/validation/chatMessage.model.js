const chatMessageSchema = joi => ({
  text: joi.string().required(),
  channel: joi.string().required(),
})

module.exports = chatMessageSchema
