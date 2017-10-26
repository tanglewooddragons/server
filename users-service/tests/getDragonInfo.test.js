const { assert } = require('chai')

const sequelize = require('../db')
const { makeGetDragonInfo } = require('../actions')
const Dragon = require('../db/Dragon')

beforeEach(async () => {
  await Dragon.sync({ force: true })
  getDragonInfo = makeGetDragonInfo(Dragon)
})

describe('getDragon', async () => {
  it('Returns correct dragon', async () => {
    const dragon = {
      name: 'Cargh',
      gender: 'MALE',
      description: 'A test dragon'
    }

    const newDragon = await Dragon.create(dragon)

    const data = {
      params: {
        id: newDragon.id
      }
    }

    const result = await getDragonInfo(data)

    assert.equal(result.body.id, data.params.id, 'Returns incorrect id')
    assert.equal(result.body.name, dragon.name, 'Returns incorrect name')
    assert.equal(result.body.gender, dragon.gender, 'Returns incorrect gender')
  })
})