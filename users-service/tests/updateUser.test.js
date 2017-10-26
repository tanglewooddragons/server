const { assert } = require('chai')

const sequelize = require('../db')
const { makeUpdateUser } = require('../actions')
const User = require('../db/User')

beforeEach(async () => {
  await User.sync({ force: true })
  updateUser = makeUpdateUser(User)
})

describe('updateUser', async () => {
  it('Updates data correcly', async () => {
    const user = await User.create({
      username: 'John',
      email: 'John@Doe.com',
      password: '123'
    })


    const data = {
      params: {
        id: user.id
      },
      request: {
        body: {
          username: 'Josh'
        }
      }
    }

    const result = await updateUser(data)

    assert.equal(result.body.username, data.request.body.username, 'It didnt change the username')
  })

  it('Does NOT allow to update secured fields', async () => {
    const user = await User.create({
      username: 'John',
      email: 'John@Doe.com',
      password: '123'
    })
    
    const data = {
      params: {
        id: user.id
      },
      request: {
        body: {
          role: 'Admin'
        }
      }
    }

    const result = await updateUser(data)
    
    assert.equal(result.body.role, 'user', 'It allowed to change secured field')
  })
})
