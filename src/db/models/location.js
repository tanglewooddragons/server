const thinky = require('../thinky')

const Location = thinky.createModel('Location', {
  name: thinky.type.string().required(),
  goodTerrain: thinky.type.string().required(),
  badTerrain: thinky.type.string().required(),
  possibleDrop: [{
    itemId: thinky.type.string().required(),
    chance: thinky.type.number().required(),
    min: thinky.type.number(),
    max: thinky.type.number(),
  }],
  stat: thinky.type.string().required(),
  hierogliph: thinky.type.string().required(),
})

module.exports = Location
