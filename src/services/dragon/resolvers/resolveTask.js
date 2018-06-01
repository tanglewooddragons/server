const { getLocation } = require('db/location')
const { getItem } = require('db/item')

/*
  Resolving a task should consist of:
    - generating loot
    - adding loot to users inventory
    - pushing a notification to user
    - sending a message to user
*/

module.exports = async (data) => {
  // --- Generate the loot ---
  const duration = data.duration
  const locationName = data.location

  const location = await getLocation(locationName)
  const possibleDrop = await Promise.all(location
    .possibleDrop
    .map(getItem)
  )

  // @TODO
  // For every hour of task, for every item:
  // Pick a random number <0,1>
  // If it's bigger than the item drop chance:
  //   Randomize amount
  //   Add the item to drops
  // ---
}
