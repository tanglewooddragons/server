const thinky = require('../thinky')

const DragonStatus = thinky.createModel('DragonStatus', {
  dragonId: thinky.type.string().required(),
  type: thinky.type.string(),
  startTime: thinky.type.date().default(thinky.r.now()),
  duration: thinky.type.number(),
  endTime: thinky.type.date().default(thinky.r.now()),
  details: thinky.type.object(),
})

module.exports = DragonStatus
