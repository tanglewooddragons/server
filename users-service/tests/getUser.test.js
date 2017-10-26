const { assert } = require('chai')

const sequelize = require('../db')
const { makeGetUser } = require('../actions')
const User = require('../db/User')
const Dragon = require('../db/Dragon')

beforeEach(async () => {
  await User.sync({ force: true })
  getUser = makeGetUser(User, Dragon)
})

describe('getUser', async () => {
  it('Returns correct user', async () => {
    const user = {
      username: 'Jack',
      email: 'Jack@sea.com',
      password: '123'
    }

    const newUser = await User.create(user)
    const dragon = await Dragon.create({ name: 'Aos', ownerId: newUser.id })

    const data = {
      params: {
        id: newUser.id 
      }
    }

    const result = await getUser(data) 
    
    assert.equal(result.body.id, data.params.id, 'Returns wrong id')
    assert.equal(result.body.email, user.email, 'Returns wrong email')
  })

  it('Does NOT return user password', async () => {
    const user = {
      username: 'Alice',
      email: 'Alice@wonderland.co',
      password: 'abc'
    }

    const newUser = await User.create(user)

    const result = await getUser({ params: { id: newUser.id } })

    assert.equal(result.body.password, undefined, 'It returns user password')
  })
})
