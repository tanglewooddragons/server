const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('updateDragon', () => {
    /*
    Login to get token
    */
    let dragon
    let token
    before(async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .then((res) => {
          token = res.body.token
        })

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

    it('Updates dragon correctly', (done) => {
      request(app)
        .post(`/api/dragon/${dragon.id}`)
        .send({
          name: 'Jeremy',
          aspect: 'light',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.name, 'Jeremy', 'Dragon was not updated')
          done()
        })
    })

    it('Does NOT allow to update secured fields', (done) => {
      request(app)
        .post(`/api/dragon/${dragon.id}`)
        .send({
          aspect: 'cheese',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.aspect, dragon.aspect, 'It updated secured field')
          done()
        })
    })
  })
}
