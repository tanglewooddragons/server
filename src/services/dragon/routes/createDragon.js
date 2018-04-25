const { createDragon } = require('db/dragon')
const { getUserById } = require('db/user')
const { isBasicAspect } = require('constants/aspects')
const { DRAGON_LIMIT } = require('constants/dragon')
const validate = require('services/validation')

const getRandomGender = () => ((Math.random() > 0.5) ? 'male' : 'female')

const create = async (ctx) => {
  const body = ctx.request.body

  try {
    await validate(body, 'dragon')
  } catch (validationError) {
    ctx.throw(422, validationError)
  }

  const user = await getUserById(ctx.state.user.id)
  const amountOfDragons = user.dragons.length

  if (amountOfDragons >= DRAGON_LIMIT) {
    ctx.throw(400, ctx.i18n.__('dragon.error.max_amount'))
  }

  if (!isBasicAspect(body.aspect)) {
    ctx.throw(400, ctx.i18n.__('dragon.error.not_basic_tier'))
  }

  const dragonData = {
    owner: ctx.state.user.id,
    name: body.name,
    gender: getRandomGender(),
    aspect: body.aspect.toLowerCase(),
  }

  const created = await createDragon(dragonData)

  if (!created) {
    ctx.throw(400, ctx.i18n.__('dragon.error.create_dragon'))
  }

  ctx.status = 201
  ctx.body = created
}

module.exports = create
