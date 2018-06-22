const request = require('supertest')

module.exports = function (app) {
  describe('removeDragon', () => {
    let dragon
    let token

    beforeAll(async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .then((res) => {
          token = res.body.accessToken
        })

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

    test('Removes correct dragon', (done) => {
      request(app)
        .delete(`/api/dragon/${dragon.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body).toBe(true)
          done()
        })
    })
  })
}
