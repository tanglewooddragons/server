const random = require('util/random')

/*
  Resolving a task should consist of:
    - generating loot
    - adding loot to users inventory
    - pushing a notification to user
    - sending a message to user
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
    .map(getItem)
  )

  const rounds = Array(duration)
  const loot = rounds.reduce((acc) => {
    possibleDrop.forEach((drop) => {
      const roll = Math.random()
      const dropped = roll >= drop.rarityData.chance

      if (!dropped) return

      if (drop.unique) {
        acc.items = acc.items.concat([drop])
        return
      }

      const amountDropped = random(
        drop.rarityData.min,
        drop.rarityData.max
      )

      acc[drop.name] = amountDropped
    })

    return acc
  }, {})
  // ---

  return loot
}

module.exports = makeResolveTask
