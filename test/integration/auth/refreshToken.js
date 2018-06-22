const request = require('supertest')

module.exports = function (app) {
  describe('refreshToken', () => {
    let accessToken
    let refreshToken

    beforeAll((done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .end((err, res) => {
          accessToken = res.body.accessToken
          refreshToken = res.body.refreshToken
          done()
        })
    })

    test('Should NOT return new access token when no refresh token was provided', (done) => {
      request(app)
        .post('/api/refreshToken')
        .expect(400)
        .end((err, res) => {
          expect(res.body.accessToken).not.toBeDefined()
          done()
        })
    })

    test('Should recieve new access token on successfull call', (done) => {
      request(app)
        .post('/api/refreshToken')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          refreshToken,
        })
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.accessToken).toBeDefined()
          done()
        })
    })
  })
}
