const {
  MIN_TASK_DURATION,
  MAX_TASK_DURATION,
} = require('constants/task')

const taskSchema = joi => ({
  dragonId: joi.string().required(),
  duration: joi
    .number()
    .integer()
    .min(MIN_TASK_DURATION)
    .max(MAX_TASK_DURATION)
    .required(),
  location: joi
    .string()
    .required(),
})

module.exports = taskSchema
