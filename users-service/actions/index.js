const getUser = require('./getUser')
const createUser = require('./createUser')
const updateUser = require('./updateUser')
const deleteUser = require('./deleteUser')

const getDragonInfo = require('./getDragonInfo')
const updateDragon = require('./updateDragon')
const getUserDragons = require('./getUserDragons')

const loginUser = require('./loginUser')

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getDragonInfo,
  updateDragon,
  getUserDragons,
  loginUser
}
