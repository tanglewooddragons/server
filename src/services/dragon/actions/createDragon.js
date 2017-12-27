const {
  createDragon,
} = require('../../../db/dragon')
const validate = require('../../../validation')

const getRandomGender = () => ((Math.random() > 0.5) ? 'male' : 'female')

const getRandomAspect = () => {
  // @TODO move this to separate file -> constants
  const aspects = ['fire', 'water', 'air']
  const index = Math.floor(Math.random() * aspects.length)
  return aspects[index]
}

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
    aspect: getRandomAspect(),
  }

  const created = await createDragon(dragonData)

  if (!created) {
    ctx.throw(400, 'Error creating dragon')
  }

  ctx.status = 201
  ctx.body = created
}

module.exports = create