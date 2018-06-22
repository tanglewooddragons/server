const request = require('supertest')

module.exports = function (app) {
  describe('deleteUser', async () => {
    let token

    beforeAll((done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test2@test.com',
          password: 'test',
        })
        .end((err, res) => {
          token = res.body.accessToken
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
  })
}
