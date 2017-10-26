const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
  id: String,
  scheduled: Date,
  date: Date,
  data: Object,
  fired: Boolean
})

module.exports = scheduleSchema
