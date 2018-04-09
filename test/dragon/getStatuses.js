const request = require('supertest')

module.exports = function (app) {
  describe('getStatuses', () => {
    /*
    Login to get token
    */
    let token
    beforeAll(async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .then((res) => {
          token = res.body.token
        })

      // Create dragon
      await request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
    })

    test('Returns dragon statuses', (done) => {
      request(app)
        .get('/api/dragon/statuses')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body.length).toBeGreaterThan(0)
          done()
        })
    })
  })
}
