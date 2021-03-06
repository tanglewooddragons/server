const joi = require('joi')
const register = require('./register.model')(joi)
const updateUser = require('./updateUser.model')(joi)
const dragon = require('./dragon.model')(joi)
const schedule = require('./schedule.model')(joi)
const chatMessage = require('./chatMessage.model')(joi)
const task = require('./task.model')(joi)
const message = require('./message.model')(joi)

const schemas = Object.create({
  register,
  updateUser,
  dragon,
  schedule,
  chatMessage,
  task,
  message,
})

const validate = (object, type) =>
  new Promise((resolve, reject) => {
    const { error, value } = joi.validate(object, schemas[type])

    if (error) {
      reject(error)
    }

    resolve(value)
  })

module.exports = validate
