const thinky = require('../thinky')

const Dragon = thinky.createModel('Dragon', {
    name: thinky.type.string().required(),
    description: thinky.type.string().default(''),
    owner: thinky.type.string().required(),
    gender: thinky.type.boolean().required(),
    born: thinky.type.date().default(thinky.r.now()),
    bgImage: thinky.type.string().default(''),
    fed: thinky.type.boolean().default(false),
    level: thinky.type.number().default(0),
    aspect: thinky.type.string().required(),
    stats: {
        con: thinky.type.number(),
        int: thinky.type.number(),
        str: thinky.type.number(),
        agl: thinky.type.number(),
        wlp: thinky.type.number(),
        lck: thinky.type.number()
    }
})

Dragon.hasOne(Dragon, 'father', 'fatherId', 'id')
Dragon.hasOne(Dragon, 'mother', 'motherId', 'id')

module.exports = Dragon
