const {
  updateUserById,
} = require('../../../db/user')
const validate = require('../../../validation')
const hash = require('../../../util/hash')

const updateUser = async (ctx) => {
  const id = ctx.state.user.id
  const updateData = ctx.request.body

  try {
    await validate(updateData, 'updateUser')
  } catch (validationError) {
    ctx.throw(422, validationError)
  }

  const secured = [
    'registartionDate',
    'confirmed',
    'premium',
    'role',
    'silver',
    'sapphires',
    'inventory',
  ]

  const validKeys = Object
    .keys(updateData)
    .filter(key => !secured.includes(key))

  const filteredUpdate = validKeys
    .reduce((data, key) => {
      if (key === 'password') {
        return hash(updateData[key])
          .then(hashed => Object.assign(data, { password: hashed }))
      }

      data[key] = updateData[key]
      return data
    }, {})

  const update = await updateUserById(id, filteredUpdate)

  if (!update) {
    ctx.throw(400, 'Error updating user')
    return
  }

  delete update.password
  ctx.body = update
}

module.exports = updateUser
