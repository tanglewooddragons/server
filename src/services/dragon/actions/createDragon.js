const {
  createDragon,
} = require('db/dragon')
const validate = require('services/validation')

const getRandomGender = () => ((Math.random() > 0.5) ? 'male' : 'female')

const create = async (ctx) => {
  const body = ctx.request.body

  try {
    await validate(body, 'dragon')
  } catch (validationError) {
    ctx.throw(422, validationError)
  }

  // @TODO
  // Check if aspect exists and is of basic tier

  const dragonData = {
    owner: ctx.state.user.id,
    name: body.name,
    gender: getRandomGender(),
    aspect: body.aspect.toLowerCase(),
  }

  const created = await createDragon(dragonData)

  if (!created) {
    ctx.throw(400, 'Error creating dragon')
  }

  ctx.status = 201
  ctx.body = created
}

module.exports = create
