const request = require('supertest')

module.exports = function (app) {
  describe('sendMessage', () => {
    let user
    let token

    beforeAll(async () => {
      user = await global.login(app)
      token = user.accessToken
    })

    test('Fails to send the message with missing parameters', async () =>
      request(app)
        .post('/api/message')
        .send({
          topic: 'I have only topic',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .then((res) => {
          expect(res.body.error).toBeTruthy()
        })
    )

    test('Send message successfully when body is correct', async () => {
      const message = {
        to: '[TEST]',
        topic: 'Send test',
        text: 'This should be alright',
      }

      return request(app)
        .post('/api/message')
        .send(message)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          const {
            from,
            to,
            text,
            topic,
          } = res.body

          expect(from).toBe(user.id)
          expect(to).toBe(message.to)
          expect(text).toBe(message.text)
          expect(topic).toBe(message.topic)
        })
    })
  })
}
