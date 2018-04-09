const request = require('supertest')

module.exports = function (app) {
  describe('deleteUser', async () => {
    /*
    Login to get token
    */
    let token
    beforeAll((done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test2@test.com',
          password: 'test',
        })
        .end((err, res) => {
          token = res.body.token
          done()
        })
    })

    test('Should delete tokens owner', (done) => {
      request(app)
        .delete('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body).toBe(true)
          done()
        })
    })

    test('Should delete token', (done) => {
      request(app)
        .get('/api/user/123')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })
  })
}
