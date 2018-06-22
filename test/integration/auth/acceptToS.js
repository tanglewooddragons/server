const request = require('supertest')

module.exports = function (app) {
  describe('acceptToS', () => {
    let user
    let token

    beforeAll(async () => {
      user = await global.login(app)
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
