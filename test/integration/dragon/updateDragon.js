const request = require('supertest')

module.exports = function (app) {
  describe('updateDragon', () => {
    let dragon
    let token

    beforeAll(async () => {
      const user = await global.login(app)
      token = user.accessToken

      // Create dragon
      await request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Marley',
          aspect: 'chaos',
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          dragon = res.body
        })
    })

    test('Updates dragon correctly', (done) => {
      request(app)
        .post(`/api/dragon/${dragon.id}`)
        .send({
          name: 'Jeremy',
          aspect: 'light',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.name).toBe('Jeremy')
          done()
        })
    })

    test('Does NOT allow to update secured fields', (done) => {
      request(app)
        .post(`/api/dragon/${dragon.id}`)
        .send({
          aspect: 'cheese',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.aspect).toBe(dragon.aspect)
          done()
        })
    })
  })
}
