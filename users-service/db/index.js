const Sequelize = require('sequelize')
const config = require('../config')[process.env.NODE_ENV || 'development']

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
})

sequelize.sync({ force: true })

module.exports = sequelize
