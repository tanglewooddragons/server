const request = require('supertest')

const { sendMessage } = require('db/message')

module.exports = function (app) {
  describe('getMessages', () => {
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

    test('Returns nothing when there are no messages', async () =>
      request(app)
        .get('/api/message/all')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          const {
            sent,
            received,
          } = res.body

          expect(sent.length).toBe(0)
          expect(received.length).toBe(0)
        })
    )

    test('Returns both sent and received messages when they are present', async () => {
      await Promise.all([
        sendMessage({
          to: user.id,
          from: '[TEST]',
          topic: 'Message Test',
          text: 'Hello there',
        }),
        sendMessage({
          from: user.id,
          to: '[TEST]',
          topic: 'Other way around',
          text: 'This should end in sent',
        }),
      ])

      return request(app)
        .get('/api/message/all')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          const {
            sent,
            received,
          } = res.body

          expect(sent.length).toBe(1)
          expect(received.length).toBe(1)

          expect(sent[0].from).toBe(user.id)
          expect(received[0].to).toBe(user.id)
        })
    })
  })
}
