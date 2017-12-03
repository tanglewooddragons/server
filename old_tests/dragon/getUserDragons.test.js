const { assert } = require('chai')

const sequelize = require('../db')
const { getUserDragons } = require('../actions')
const User = require('../db/User')
const Dragon = require('../db/Dragon')

before(async () => {
  await User.sync({ force: true })
  await Dragon.sync({ force: true })
})

describe('#getUserDragons', async () => {
  it('Returns all user dragons', async () => {
    const user = await User.create({
      username: 'Jerry',
      email: 'Jerry@a.com',
      password: 'eee'
    })

    const dragon1 = {
      name: 'Billy'
    }

    const dragon2 = {
      name: 'Joel'
    }

    const dragons = [
      await Dragon.create(dragon1),
      await Dragon.create(dragon2)
    ]

    await user.setDragons(dragons)

    /*
    // Tez dziala
    await Dragon.create({
      name: 'Joseph',
      ownerId: '1'
    })
    */

    const request = {
      params: {
        id: user.id
      }
    }

    const result = await getUserDragons(request)

    assert.equal(result.body.length, 2, 'It returns incorrect amount of dragons')
    assert.equal(result.body[0].ownerId, user.id, 'It sets incorrect owner')
  })
})
