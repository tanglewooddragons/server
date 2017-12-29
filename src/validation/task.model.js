const taskSchema = joi => ({
  scheduledBy: joi.string().required(),
  scheduledFor: joi.date().required(),
  data: joi.object().optional(),
  type: joi.string().required(),
})

module.exports = taskSchema
