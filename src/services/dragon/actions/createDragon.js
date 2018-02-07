const {
  createDragon,
} = require('db/dragon')
const validate = require('services/validation')
const { getBasicAspect } = require('../constants/aspects')

const getRandomGender = () => ((Math.random() > 0.5) ? 'male' : 'female')

const create = async (ctx) => {
  const body = ctx.request.body

  try {
    await validate(body, 'dragon')
  } catch (validationError) {
    ctx.throw(422, validationError)
  }

  const dragonData = {
    owner: ctx.state.user.id,
    name: body.name,
    gender: getRandomGender(),
    aspect: getBasicAspect(),
  }

  const created = await createDragon(dragonData)

  if (!created) {
    ctx.throw(400, 'Error creating dragon')
  }

  ctx.status = 201
  ctx.body = created
}

module.exports = create
