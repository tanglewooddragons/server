const request = require('supertest')

module.exports = function (app) {
  describe('login', () => {
    let token
    let user

    test('Should recieve token on login', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.accessToken).toBeDefined()
          expect(res.body.refreshToken).toBeDefined()
          token = res.body.accessToken
          user = res.body
          done()
        })
    })

    test('Should not be able to get resource without token', (done) => {
      request(app)
        .get(`/api/user/${user.id}`)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.status).toBe(401)
          done()
        })
    })

    test('Should be able to get resource with valid token', (done) => {
      request(app)
        .get(`/api/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body).toBeDefined()
          done()
        })
    })
  })
}
