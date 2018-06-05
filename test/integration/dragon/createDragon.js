const request = require('supertest')

module.exports = function (app) {
  describe('createDragon', () => {
    /*
    Login to get token
    */
    let user
    let token
    beforeAll((done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .end((err, res) => {
          user = res.body
          token = res.body.accessToken
          done()
        })
    })

    test('Fails to register with missing name', (done) => {
      request(app)
        .post('/api/dragon/create')
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })

    test('Creates dragon with proper data provided', (done) => {
      request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })

    test('Sets current user as dragon owner', (done) => {
      request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.owner).toBe(user.id)
          done()
        })
    })

    test('Fails to create dragon with non-basic tier provided', (done) => {
      request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'clockwork',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })
  })
}
