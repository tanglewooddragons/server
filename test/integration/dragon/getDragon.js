const request = require('supertest')

module.exports = function (app) {
  describe('getDragon', () => {
    let dragon
    let token

    beforeAll(async () => {
      const user = await global.login(app)
      token = user.accessToken

      // Create dragon
      await request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          dragon = res.body
        })
    })

    test('Returns correct dragon', (done) => {
      request(app)
        .get(`/api/dragon/${dragon.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.id).toBe(dragon.id)
          done()
        })
    })
  })
}
