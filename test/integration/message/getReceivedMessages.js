const request = require('supertest')

module.exports = function (app) {
  describe('getReceivedMessages', () => {
    let token

    beforeAll(async () => {
      const user = await global.login(app)
      token = user.accessToken
    })

    test('Returns only received messages', async () =>
      request(app)
        .get('/api/message/received')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          const body = res.body
          expect(body.length).toBe(1)
        })
    )
  })
}
