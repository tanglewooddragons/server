const request = require('supertest')

module.exports = function (app) {
  describe('sendMessage', () => {
    let token
    let user

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      token = response.body.accessToken
      user = response.body
    })

    it('Fails to send the message with missing parameters', async () =>
      request(app)
        .post('/api/message')
        .send({
          topic: 'I have only topic',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .then((res) => {
          expect(res.body).toEqual({})
        })
    )

    it('Send message successfully when body is correct', async () => {
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
