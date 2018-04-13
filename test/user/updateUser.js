const request = require('supertest')

module.exports = function (app) {
  describe('updateUser', async () => {
    /*
    Login to get token
    */
    let token
    beforeAll((done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .end((err, res) => {
          token = res.body.accessToken
          done()
        })
    })

    test('Should update fields', (done) => {
      request(app)
        .put('/api/user')
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
        .put('/api/user')
        .send({
          role: 'admin',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body).toEqual({})
          done()
        })
    })
  })
}
