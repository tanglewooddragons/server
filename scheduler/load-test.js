const initAmqp = require('./amqp')
const uuid = require('uuid/v4')

const types = [ 'Task', 'Training', 'Event', 'Battle' ]

const generateRandomEvent = () => {
  return {
    id: uuid(),
    date: Date.now(),
    data: {
      userId: Math.floor(Math.random() * 1000),
      type: types[Math.floor(Math.random() * types.length)]
    }
  }
}

const test = async () => {
  const amount = 200

  const events = new Array(amount)
    .fill(0)
    .map(_ => generateRandomEvent())

  const {
    subscribe,
    send,
    close
  } = await initAmqp()

  const startTime = Date.now()
  
  let recieved = 0

  await subscribe(`schedule.job.*`, (msg) => {
    recieved++
    console.log('Recieved: ', recieved)
    if (recieved === amount) {
      const endTime = Date.now()
      const deltaTime = endTime - startTime
      const secondsElapsed = deltaTime / 1000
      const avgPerReq = secondsElapsed / amount
      console.log('Got all requests')
      console.log(`Time: ${secondsElapsed}s`)
      console.log(`Average time per request: ${avgPerReq}s`)

      close()
    }
  })
  
  events.forEach((event) => {
    send('schedule', event)
  })
}

test()
