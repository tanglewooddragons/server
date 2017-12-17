const joi = require('joi')
const register = require('./register.model')(joi)
const updateUser = require('./updateUser.model')(joi)

const schemas = Object.create({
  register,
  updateUser,
})

const validate = (object, type) =>
  new Promise((resolve, reject) => {
    const { error, value } = joi.validate(object, schemas[type])

    if (error) {
      reject(new Error(error))
    }

    resolve(value)
  })

module.exports = validate
