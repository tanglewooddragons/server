const { assert } = require('chai')
const sinon = require('sinon')

const sequelize = require('../db')
const User = require('../db/User')
const { deleteUser } = require('../actions')

before(async () => {
  await User.sync({ force: true })
})

describe('#deleteUser', () => {
  it('It should remove correct user', async () => {
    const user = await User.create({
      username: 'test',
      email: 'removal@trash.bin',
      password: 'waste_basket'
    })

    const req = {
      params: {
        id: user.id
      }
    }

    const result = await deleteUser(req)

    assert.notEqual(result.body, 0, 'It didnt remove user')
  })
})