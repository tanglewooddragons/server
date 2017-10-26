const initAmqp = require('./amqp')

const start = async () => {
  const {
    subscribe,
    send,
    stop
  } = await initAmqp()

  const task = {
    id: Date.now(),
    date: Date.now() + 3000,
    data: {
      userId: 7,
      type: 'Event'
    }
  }

  
  await subscribe(`schedule.status.*`, (msg) => {
    console.log('Got status:', msg)
  })

  await subscribe(`schedule.job.*`, (msg) => {
    console.log('Got job:', msg)
  })

  await subscribe(`schedule.job.${task.id}`, (msg) => {
    console.log('Got job:', msg)
  })

  await subscribe(`schedule.status.${task.id}`, (msg) => {
    console.log('Got status:', msg)
  })

  send('schedule', task)
}

start()
