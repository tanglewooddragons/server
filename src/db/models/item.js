const thinky = require('../thinky')
const Rarity = require('./rarity')

const Item = thinky.createModel('Item', {
  name: thinky.type.string().required(),
  unique: thinky.type.boolean().required(),
  rarity: thinky.type.string().required(),
  description: thinky.type.string(),
})

Item.hasOne(Rarity, 'rarityData', 'rarity', 'name')

module.exports = Item
