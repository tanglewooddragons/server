const amqp = require('amqplib')

const log = require('../util/logger')

const amqpUrl = process.env.amqp ? `amqp://${process.env.amqp}` : 'amqp://localhost'
const exchange = process.env.exchange ? process.env.exchange : 'tanglewood.schedule'

const queueConfig = {
  durable: true,
  autoDelete: false
}

const initAmqp = async () => {
  const connection = await amqp.connect(amqpUrl)
  const channel = await connection.createChannel()
  const assertQueue = await channel.assertExchange(exchange, 'topic')
  channel.prefetch(1)
  
  return {
    subscribe: async (topic, handler) => {
      log.info('Subscribing to:', topic)
      const { queue } = await channel.assertQueue(
        `tanglewood-${topic}-queue`,
        queueConfig
      )
      await channel.bindQueue(queue, exchange, topic)
      await channel.consume(queue, (data) => {
        if (!data) return

        const msg = JSON.parse(data.content.toString())
        channel.ack(data)

        handler(msg)
      })
    },
    send: (to, data) => {
      log.info('Sending data to:', to)
      channel.publish(exchange, to, new Buffer(JSON.stringify(data)))
    },
    close: async () => {
      await channel.close()
      await connection.close()
    }
  }
}

module.exports = initAmqp
