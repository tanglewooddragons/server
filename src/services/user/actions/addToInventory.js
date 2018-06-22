const makeAddToInventory = ({
  getUserById,
  updateUserById,
}) => async (userId, items) => {
  const user = await getUserById(userId)
  const inventory = user.inventory.slice()

  items.forEach((item) => {
    const id = item.id

    const exists = inventory.find(x => x.id === id)

    if (!exists) {
      inventory.push(item)
    } else {
      exists.amount += item.amount
    }
  })

  return updateUserById(userId, {
    inventory,
  })
}

module.exports = makeAddToInventory
