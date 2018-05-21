const request = require('supertest')

const LoginInfo = require('db/models/loginInfo')

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

    test('Should not log in if user is banned', async () => {
      // Ban account
      const loginInfo = await LoginInfo.filter({ email: 'test2@test.com' }).run()
      const banDate = Date.now() + (60 * 60 * 1000000)
      loginInfo[0].bannedUntil = banDate
      await loginInfo[0].save()

      // Test login
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test2@test.com',
          password: 'test',
        })

      expect(response.status).toBe(403)
      expect(response.error).toBeDefined()

      // Lift the ban back for further testing
      loginInfo[0].bannedUntil = null
      await loginInfo[0].save()
    })
  })
}
