const request = require('supertest')

module.exports = function (app) {
  describe('acceptToS', () => {
    let user
    let token

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      user = response.body
      token = user.accessToken
    })

    test('Changes should be reflected in user profile', async () =>
      request(app)
        .get('/api/acceptToS')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.body.termsOfService.accepted).toBe(true)
          expect(res.body.termsOfService.acceptDate).toBeDefined()
        })
    )
  })
}
