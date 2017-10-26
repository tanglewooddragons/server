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
    const affectedRowsNum = result.body[0]
    const affectedRows = result.body[1]

    const username = affectedRows[0].username

    assert.equal(affectedRowsNum, 1, 'It changed wrong amount of rows')
    assert.equal(username, data.request.body.username, 'It didnt change the username')
  })

  it('Does NOT allow to update secured fields', async () => {
    const data = {
      params: {
        id: 1
      },
      request: {
        body: {
          role: 'Admin'
        }
      }
    }

    const result = await updateUser(data)

    const afftectedNumber = result.body[0]
    const affectedRows = result.body[1]

    assert.equal(afftectedNumber, 0, 'It updates fields')
    assert.equal(affectedRows.length, 0, 'It updates fields')
  })
})