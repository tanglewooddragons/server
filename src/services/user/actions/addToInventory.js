const makeAddToInventory = ({
  getUserById,
  updateUserById,
}) => async (userId, { ingredients, items }) => {
  const user = await getUserById(userId)

  const updatedIngredients = Object.keys(ingredients).reduce((acc, ingredient) => {
    if (!acc[ingredient]) acc[ingredient] = 0
    acc[ingredient] += ingredients[ingredient]
    return acc
  }, Object.assign({}, user.inventory.ingredients))

  const updatedItems = user.inventory.items.concat(items)

  return updateUserById(userId, {
    inventory: {
      ingredients: updatedIngredients,
      items: updatedItems,
    },
  })
}

module.exports = makeAddToInventory
