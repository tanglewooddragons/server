const request = require('supertest')

module.exports = function (app) {
  describe('getSentMessages', () => {
    let token

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      token = response.body.accessToken
    })

    test('Returns only sent messages', async () =>
      request(app)
        .get('/api/message/sent')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          const body = res.body
          expect(body.length).toBe(1)
        })
    )
  })
}
