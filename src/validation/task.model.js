const taskSchema = joi => ({
  scheduledBy: joi.string().required(),
  scheduledFor: joi.date().required(),
  data: joi.object().optional(),
})

module.exports = taskSchema
