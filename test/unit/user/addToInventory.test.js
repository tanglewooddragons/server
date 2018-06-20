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

describe('addToInventory', () => {
  beforeEach(() => {
    user.inventory = []
  })

  test('Adds items to inventory', async () => {
    const ingredients = [{
      id: 'Cherry Petals',
      amount: 3,
    }]

    const updated = await addToInventory('test', ingredients)

    expect(updated.inventory).toEqual(ingredients)
  })

  test('Correctly add ingredient quantity', async () => {
    const batch1 = [{
      id: 'Sword Pearls',
      amount: 3,
    }]

    const batch2 = [{
      id: 'Sword Pearls',
      amount: 5,
    }]

    await addToInventory('test', batch1)

    const updated = await addToInventory('test', batch2)

    const inv = updated.inventory
    const pearls = inv.find(x => x.id === 'Sword Pearls')

    expect(pearls.amount).toBe(8)
  })
})
