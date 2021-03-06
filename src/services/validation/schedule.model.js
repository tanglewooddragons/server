const scheduleSchema = joi => ({
  scheduledBy: joi.string().required(),
  scheduledFor: joi.alternatives().try(
    joi.date(),
    joi.string(),
    joi.object(),
  ).required(),
  details: joi.object().optional(),
  type: joi.string().required(),
})

module.exports = scheduleSchema
