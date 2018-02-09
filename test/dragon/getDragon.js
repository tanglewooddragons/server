const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('getDragon', () => {
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
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          dragon = res.body
        })
    })

    it('Returns correct dragon', (done) => {
      request(app)
        .get(`/api/dragon/${dragon.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.id, dragon.id, 'Returns wrong dragon')
          done()
        })
    })
  })
}
