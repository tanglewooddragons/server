const request = require('supertest')

module.exports = function (app) {
  describe('updateUser', async () => {
    let token

    beforeAll(async () => {
      const user = await global.login(app)
      token = user.accessToken
    })

    test('Should update fields', (done) => {
      request(app)
        .post('/api/user')
        .send({
          country: 'Poland',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.country).toBe('Poland')
          done()
        })
    })

    test('Should NOT update secured fields', (done) => {
      request(app)
        .post('/api/user')
        .send({
          role: 'admin',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.error).toBeTruthy()
          done()
        })
    })
  })
}
