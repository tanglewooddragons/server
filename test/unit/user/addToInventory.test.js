const makeAddToInventory = require('services/user/actions/addToInventory')

const user = {
  inventory: {
    ingredients: {},
    items: [],
  },
}

const getUserById = async () => user
const updateUserById = (_, x) => {
  const newInventory = Object.assign(
    user.inventory,
    x.inventory
  )

  user.inventory = newInventory
  return user
}

const addToInventory = makeAddToInventory({
  getUserById,
  updateUserById,
})

describe.only('addToInventory', () => {
  beforeEach(() => {
    user.inventory = {
      ingredients: {},
      items: [],
    }
  })

  test('Adds items to inventory', async () => {
    const ingredients = {
      'Cherry Petals': 3,
    }

    const updated = await addToInventory('test', {
      ingredients,
    })

    expect(updated.inventory.ingredients).toEqual(ingredients)
  })

  test('Correctly add ingredient quantity', async () => {
    const batch1 = {
      'Sword Pearls': 3,
    }

    const batch2 = {
      'Sword Pearls': 5,
    }

    await addToInventory('test', {
      ingredients: batch1,
    })

    const updated = await addToInventory('test', {
      ingredients: batch2,
    })

    const ingredients = updated.inventory.ingredients
    const pearls = ingredients['Sword Pearls']

    expect(pearls).toBe(8)
  })
})
