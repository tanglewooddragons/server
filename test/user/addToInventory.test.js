const makeAddToInventory = require('services/user/actions/addToInventory')

const getUserById = async () => ({
  inventory: {
    ingredients: {},
    items: [],
  },
})
const updateUserById = (_, x) => x

const addToInventory = makeAddToInventory({
  getUserById,
  updateUserById,
})

describe('addToInventory', () => {
  test('Adds items to inventory', async () => {
    const ingredients = {
      'Cherry Petals': 3,
    }

    const updated = await addToInventory('test', {
      ingredients,
    })

    expect(updated.inventory.ingredients).toEqual(ingredients)
  })
})
