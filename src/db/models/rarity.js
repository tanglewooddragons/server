const thinky = require('../thinky')

const Rarity = thinky.createModel('Rarity', {
  name: thinky.type.string().required(),
  chance: thinky.type.number().required(),
  min: thinky.type.number().default(0),
  max: thinky.type.number().required(),
})

module.exports = Rarity
