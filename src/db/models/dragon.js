const thinky = require('../thinky')
const DragonStatus = require('./dragonStatus')

const Dragon = thinky.createModel('Dragon', {
  name: thinky.type.string().required(),
  description: thinky.type.string().default(''),
  owner: thinky.type.string().required(),
  gender: thinky.type.string().enum('male', 'female').required(),
  born: thinky.type.date().default(thinky.r.now()),
  bgImage: thinky.type.string().default(''),
  fed: thinky.type.boolean().default(false),
  level: thinky.type.number().default(0),
  aspect: thinky.type.string().required(),
  stats: thinky.type.object().schema({
    con: thinky.type.number(),
    int: thinky.type.number(),
    str: thinky.type.number(),
    agl: thinky.type.number(),
    wlp: thinky.type.number(),
    lck: thinky.type.number(),
  }).default({
    con: 0,
    int: 0,
    str: 0,
    agl: 0,
    wlp: 0,
    lck: 0,
  }),
})

Dragon.hasOne(Dragon, 'father', 'fatherId', 'id')
Dragon.hasOne(Dragon, 'mother', 'motherId', 'id')

Dragon.hasOne(DragonStatus, 'status', 'id', 'dragonId')

module.exports = Dragon
