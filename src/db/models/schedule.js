const thinky = require('../thinky')

const Schedule = thinky.createModel('Schedule', {
  fired: thinky.type.boolean().default(false),
  type: thinky.type.string().required(),
  details: thinky.type.object(),
  scheduledBy: thinky.type.string().required(),
  scheduledFor: thinky.type.any().required(),
})

module.exports = Schedule
