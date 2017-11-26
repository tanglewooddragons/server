const thinky = require('../thinky')

const Task = thinky.createModel('Task', {
  scheduled: thinky.type.date(),
  date: thinky.type.date(),
  data: thinky.type.object(),
  fired: thinky.type.boolean().default(false)
})

module.exports = Task