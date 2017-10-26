const { connect, Schedule, close } = require('../db')

const remove = async () => {
  await connect()
  console.log('Removing items..')
  await Schedule.remove({}, (err) => {
    if (err) console.log(err)
    else console.log('Collection removed')
  })

  await close()
}

remove()

