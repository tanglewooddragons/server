const joi = require('joi')
const user = require('./user.model')(joi)

const schemas = Object.create({
  user
})

const validate = (object, type) => {
  return new Promise((resolve, reject) => {
    const { error, value } = joi.validate(object, schemas[type])

    if (error) {
      reject(new Error(error))
    }

    resolve(value)
  })
}

module.exports = validate