const random = require('util/random')

/*
 * Resolving a task should consist of:
 *  - generating loot
 *  - adding loot to users inventory
 *  - pushing a notification to user
 *  - sending a message to user
 */

const makeResolveTask = ({
  getLocation,
  getItem,
}) => async (data) => {
  // --- Generate the loot ---
  const duration = data.duration
  const locationName = data.location

  const location = await getLocation(locationName)
  const possibleDrop = await Promise.all(location
    .possibleDrop
    .map(async (drop) => {
      const item = await getItem(drop.itemId)

      return Object.assign({}, drop, item)
    })
  )

  const rounds = Array(duration).fill()
  const loot = rounds.reduce((acc) => {
    possibleDrop.forEach((drop) => {
      const roll = Math.random()
      const dropped = roll >= (1 - drop.chance)

      if (!dropped) return

      if (drop.unique) {
        acc.push({
          id: drop.itemId,
        })
        return
      }

      const amountDropped = random(
        drop.min,
        drop.max
      )

      const ingredient = acc.find(
        ing => ing.id === drop.itemId
      )

      if (ingredient) {
        ingredient.amount += amountDropped
      } else {
        acc.push({
          id: drop.itemId,
          amount: amountDropped,
        })
      }
    })

    return acc
  }, [])
  // ---

  return loot
}

module.exports = makeResolveTask
