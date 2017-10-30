const { assert } = require('chai')
const sinon = require('sinon')

const sequelize = require('../db')
const { createUser } = require('../actions')
const User = require('../db/User')
const Dragon = require('../db/Dragon')

before(async () => {
  await User.sync({ force: true })
})

describe('#createUser', async () => {
  it('Returns an error when invalid props are provided', async () => {
    const data = {
      request: {
        body: {
          username: 'a'
        }
      },
      throw: sinon.stub()
    }
    const response = await createUser(data)

    assert(data.throw.calledOnce, true, 'Throw was not called')
    assert(data.throw.calledWith(400), true, 'Was not called with correct status code')
  })

  it('Returns an error when email is already taken', async () => {
    await User.create({
      username: 'John',
      email: 'John@doe.com',
      password: '123'
    })

    const data = {
      request: {
        body: {
          username: 'Johnny',
          email: 'John@doe.com',
          password: '321'
        }
      },
      throw: sinon.stub()
    }

    const response = await createUser(data)
    
    assert.equal(data.throw.calledOnce, true, 'It wwa not called')
    assert.equal(data.throw.calledWith(409), true, 'It retuns wrong status code')
  })

  it('Creates user when all props all correct', async () => {
    const data = {
      request: {
        body: {
          username: 'Adam',
          email: 'Adam@tanglewood.com',
          password: '123'
        }
      }
    }

    const response = await createUser(data)

    assert.equal(response.status, 201, 'It returns wrong status code')
  })
})
