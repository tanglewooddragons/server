const db = require('../db')

const getUserByEmail = async (email) => {
  const users = await db('users')
    .select()
    .where({
      email
    })

  return users[0]
}

module.exports = getUserByEmail
