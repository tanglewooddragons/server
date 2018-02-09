const {
  getDragonById,
} = require('db/dragon')

const {
  DRAGON_IS_STILL_EGG,
  getModifier,
} = require('../constants/dragon')
const food = require('../constants/food')

module.exports = async (ctx) => {
  const id = ctx.params.id

  const dragon = await getDragonById(id)

  if (!dragon) {
    ctx.throw(400, 'Dragon not found')
    return ctx
  }

  // Dragons of level lesser than 6 are still eggs,
  // so their stats are not being modified yet
  const isStillEgg = dragon.level <= DRAGON_IS_STILL_EGG

  // Check if dragon was already fed/warmed
  if (dragon.fed) {
    // Return appropriate errors
    if (isStillEgg) {
      ctx.throw(400, 'Egg has already been warmed')
    } else {
      ctx.throw(400, 'Dragon has already been fed')
    }

    return ctx
  }

  // If dragon is still an egg warm it and return
  if (isStillEgg) {
    dragon.level += 1
    dragon.fed = true
    await dragon.save()
    ctx.body = dragon
    return ctx
  }

  // Check if food type is proper and feed dragon
  const foodType = ctx.request.body.food.toLowerCase()

  if (!foodType) {
    ctx.throw(400, 'Invalid food type')
    return ctx
  }

  const stat = (Object
    .entries(food)
    .filter((type) => {
      if (type[1] === foodType) return true
      return false
    }))[0]

  if (!stat) {
    ctx.throw(400, 'Invalid food type')
    return ctx
  }

  const statIndex = Object.keys(food).indexOf(stat[0])

  // Get the aspect bonus to stats
  const modifier = getModifier(dragon.aspect)
  const bonus = modifier[statIndex] + 1

  // Add stat to dragon
  dragon.stats[stat[0]] += bonus

  dragon.level += 1
  dragon.fed = true
  await dragon.save()

  ctx.body = dragon
  return ctx
}
