const { assert } = require('chai')

const sequelize = require('../db')
const { updateDragon } = require('../actions')
const Dragon = require('../db/Dragon')

before(async () => {
  await Dragon.sync({ force: true }) 
})

describe('#updateDragon', async () => {
  it('Updates data correcly', async () => {
    const dragon = await Dragon.create({
      name: 'Dinky',
      gender: 'FEMALE',
      description: 'update me please'
    })

    const data = {
      params: {
        id: dragon.id
      },
      request: {
        body: {
          description: 'T. Hanks'
        }
      }
    }

    const result = await updateDragon(data)
    const updated = await Dragon.findById(data.params.id)

    assert.equal(updated.description, data.request.body.description, 'It returns the old description')
  })

  it('Does NOT allow to update secured fields', async () => {
    const dragon = await Dragon.create({
      name: 'Dinky',
      gender: 'FEMALE',
      description: 'update me please'
    })
    
    const data = {
      params: {
        id: dragon.id
      },
      request: {
        body: {
          gender: 'MALE'
        }
      }
    }

    const result = await updateDragon(data)
    const updated = await Dragon.findById(data.params.id)

    assert.notEqual(updated.gender, 'MALE', 'It updates secured fields')
  })
})
