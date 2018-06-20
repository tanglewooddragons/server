const makeResolveTask = require('services/dragon/resolvers/resolveTask')

describe('resolveTask', () => {
  test('It generates loot (ingredients)', async () => {
    const getItem = id => Promise.resolve({
      itemId: id,
      name: 'test-item',
      unique: false,
    })

    const getLocation = name => Promise.resolve({
      name,
      possibleDrop: [
        {
          itemId: '12',
          chance: 1,
          min: 1,
          max: 4,
        },
      ],
    })

    const resolveTask = makeResolveTask({
      getItem,
      getLocation,
    })

    const loot = await resolveTask({
      location: 'test',
      duration: 6,
    })

    expect(loot).toBeDefined()
    expect(loot[0].id).toBe('12')
    expect(loot[0].amount).toBeDefined()
  })

  test('It generates loot (items)', async () => {
    const getItem = id => Promise.resolve({
      itemId: id,
      name: 'test-unique-item',
      unique: true,
    })

    const getLocation = name => Promise.resolve({
      name,
      possibleDrop: [
        {
          itemId: '12',
          chance: 1,
          min: 1,
          max: 4,
        },
      ],
    })

    const resolveTask = makeResolveTask({
      getItem,
      getLocation,
    })

    const loot = await resolveTask({
      location: 'test',
      duration: 6,
    })

    expect(loot).toBeDefined()
    expect(loot[0].id).toBe('12')
    expect(loot[0].amount).not.toBeDefined()
  })

  test('It generates loot (mixed)', async () => {
    const getItem = (id) => {
      if (id === 'unique') {
        return {
          itemId: id,
          name: 'test-unique-item',
          unique: true,
        }
      }

      return {
        itemId: id,
        name: 'test-item',
        unique: false,
      }
    }

    const getLocation = name => Promise.resolve({
      name,
      possibleDrop: [
        {
          itemId: 'ingredient',
          chance: 1,
          min: 1,
          max: 4,
        },
        {
          itemId: 'unique',
          chance: 1,
        },
      ],
    })

    const resolveTask = makeResolveTask({
      getItem,
      getLocation,
    })

    const loot = await resolveTask({
      location: 'test',
      duration: 6,
    })

    expect(loot).toBeDefined()

    const ingedient = loot.find(x => x.id === 'ingredient')
    expect(ingedient).toBeDefined()

    const item = loot.find(x => x.id === 'unique')
    expect(item).toBeDefined()
  })

  test('Generated loot is within boundaries', async () => {
    const getItem = id => Promise.resolve({
      itemId: id,
      name: 'test-unique-item',
      unique: false,
    })

    const getLocation = name => Promise.resolve({
      name,
      possibleDrop: [
        {
          itemId: '12',
          chance: 1,
          min: 2,
          max: 5,
        },
      ],
    })

    const resolveTask = makeResolveTask({
      getItem,
      getLocation,
    })

    const loot = await resolveTask({
      location: 'amount-test',
      duration: 1,
    })

    const amount = loot[0].amount

    expect(amount).toBeGreaterThanOrEqual(2)
    expect(amount).toBeLessThanOrEqual(5)
  })
})
