const config = require('../config.json')[process.env.NODE_ENV || 'development']
const knex = require('knex')(config)

module.exports = knex

