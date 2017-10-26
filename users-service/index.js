const serve = require('./server')

const User = require('./db/User')
const Dragon = require('./db/Dragon')

const {
  makeGetUser,
  makeCreateUser,
  makeUpdateUser,
  makeGetDragonInfo,
  makeUpdateDragon,
  makeGetUserDragons,
} = require('./actions')

const getUser = makeGetUser(User, Dragon)
const createUser = makeCreateUser(User)
const updateUser = makeUpdateUser(User)

const getDragonInfo = makeGetDragonInfo(Dragon)
const updateDragon = makeUpdateDragon(Dragon)
const getUserDragons = makeGetUserDragons(Dragon)

serve({
  getUser,
  createUser,
  updateUser,

  getDragonInfo,
})
