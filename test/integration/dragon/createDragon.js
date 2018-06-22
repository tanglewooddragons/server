const request = require('supertest')

module.exports = function (app) {
  describe('createDragon', () => {
    let user
    let token
    let dragon

    beforeAll(async () => {
      user = await global.login(app)
      token = user.accessToken
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

    test('Creates dragon with proper data provided', (done) => {
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
          dragon = res.body
          done()
        })
    })

    test('Sets current user as dragon owner', (done) => {
      request(app)
        .get(`/api/dragon/${dragon.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.owner).toBe(user.id)
          done()
        })
    })
  })
}
