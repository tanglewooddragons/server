const request = require('supertest')

const { createDragon } = require('db/dragon')

module.exports = function (app) {
  describe('getUser', async () => {
    /*
    Login to get token
    */
    let user
    let token
    beforeAll(async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      user = response.body
      token = response.body.accessToken

      await createDragon({
        name: 'Jeff',
        gender: 'male',
        owner: user.id,
        aspect: 'light',
      })

      await createDragon({
        name: 'Geoff',
        gender: 'male',
        owner: user.id,
        aspect: 'earth',
      })
    })

    test('Returns error when user does NOT exist', (done) => {
      request(app)
        .get('/api/user/idonotexistlala')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })

    test('Returns correct user', (done) => {
      request(app)
        .get(`/api/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.id).toBe(user.id)
          done()
        })
    })

    test('Returns logged in user when no id is provided', (done) => {
      request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.id).toBe(user.id)
          done()
        })
    })

    test('Does NOT return user password', (done) => {
      request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.password).not.toBeDefined()
          done()
        })
    })

    test('Returns dragons', (done) => {
      request(app)
        .get(`/api/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.dragons.length).toBe(2)
          expect(res.body.dragons[0].owner).toBe(user.id)
          done()
        })
    })
  })
}
