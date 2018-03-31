const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('getStatuses', () => {
    /*
    Login to get token
    */
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
    })

    it('Returns dragon statuses', (done) => {
      request(app)
        .get('/api/dragon/statuses')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert(typeof res.body, 'object', 'Result body should be an array')
          assert(res.body.length > 0, 'It should have entries')
          done()
        })
    })
  })
}
