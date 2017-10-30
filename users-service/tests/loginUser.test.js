const { assert } = require('chai')
const sinon = require('sinon')

const sequelize = require('../db')
const { loginUser } = require('../actions')
const User = require('../db/User')

before(async () => {
  await User.sync({ force: true })
})

after(async () => {
  await User.sync({ force: true })
})

describe('#loginUser', async () => {
  it('Return 400 when email does NOT exist in db', async () => {
    const req = {
      request: {
        body: {
          email: 'idontexist@lala.la'
        }
      },
      throw: sinon.stub()
    }

    const response = await loginUser(req)

    assert.equal(req.throw.calledOnce, true, 'Throw wan not called')
    assert.equal(req.throw.calledWith(400), true, 'Throw called with wrong code')
  })

  it('Returns 401 when passwords do not match', async () => {
    const user = await User.create({
      username: 'Lilian',
      email: 'lily@gmail.com',
      password: 'winkelried'
    })

    const req = {
      request: {
        body: {
          email: 'lily@gmail.com',
          password: 'winkrered'
        }
      },
      throw: sinon.stub()
    }

    const response = await loginUser(req)

    assert.equal(req.throw.calledOnce, true, 'Throw was not called')
    assert.equal(req.throw.calledWith(401), true, 'Throw called with worng code')
  })

  it('Returns user object on success', async () => {
    const user = await User.create({
      username: 'Dave',
      email: 'Dave@gmail.com',
      password: 'iamtest'
    })

    const req = {
      request: {
        body: {
          email: 'Dave@gmail.com',
          password: 'iamtest'
        }
      },
      throw: sinon.stub()
    }

    const response = await loginUser(req)

    assert.equal(req.throw.called, false, 'Throw was called')
    assert.equal(response.body.id, user.id, 'Return wrong user id')
    assert.equal(response.body.password, undefined, 'Returns user password')
  })
})
