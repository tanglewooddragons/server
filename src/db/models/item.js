const thinky = require('../thinky')

const Item = thinky.createModel('Item', {
  name: thinky.type.string().required(),
  unique: thinky.type.boolean().required(),
  rarity: thinky.type.string().required(),
  description: thinky.type.string(),
})

module.exports = Item
