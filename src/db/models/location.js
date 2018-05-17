const thinky = require('../thinky')

const Location = thinky.createModel('Location', {
  name: thinky.type.string().required(),
  goodTerrain: thinky.type.string().required(),
  badTerrain: thinky.type.string().required(),
  ingredient: thinky.type.string().required(),
  stat: thinky.type.string().required(),
  hierogliph: thinky.type.string().required(),
})

module.exports = Location
