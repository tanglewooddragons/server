const {
  connect,
  Schedule,
  close
} = require('../db')

const run = async () => {
  await connect()

  console.log(await Schedule.find({
    fired: false
  }))

  close()
}

run()
