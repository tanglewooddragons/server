const Item = require('./models/item')
const log = require('util/log')

async function getItem(id) {
  try {
    const item = await Item.get(id).run()

    return item[0]
  } catch (error) {
    log.error({
      action: 'get-item',
      status: 'failed',
      error,
      data: {
        id,
      },
    })

    return null
  }
}

async function addItem(itemData) {
  try {
    const exists = await getItem(itemData.name)

    if (exists) {
      log.info(`Item ${itemData.name} already exists, skipping..`)
      return exists
    }

    const item = new Item(itemData)
    await item.save()
    log.info(`Item ${item.name} has been added successfully!`)
    return item
  } catch (err) {
    log.error(`Error adding item: ${err}`)
    return null
  }
}

module.exports = {
  getItem,
  addItem,
}
