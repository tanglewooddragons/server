const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const log = require('../util/logger')

const { mongoUrl } = require('../config')
const scheduleSchema = require('./schedule.schema.js')

const connect = async () => {
  const options = {
    useMongoClient: true
  }

  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl, options, (err) => {
      if (err) {
        log.error('Error connecting to db:', err)
        reject(err)
      }
      resolve()
    })
  })
}

const Schedule = mongoose.model('Schedule', scheduleSchema)

module.exports = {
  connect,
  Schedule,
  close: mongoose.connection.close.bind(mongoose.connection)
}
