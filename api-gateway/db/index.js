const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'users-db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  }
})

module.exports = knex

