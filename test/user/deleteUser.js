const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('deleteUser', async () => {
    /*
    Login to get token
    */
    let user
    let token
    before((done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .end((err, res) => {
          user = res.body
          token = res.body.token
          done()
        })
    })

    it('Should delete tokens owner', (done) => {
      request(app)
        .delete('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body, true, 'It failed to delete user')
          done()
        })
    })

    it('Should delete token', (done) => {
      request(app)
        .get('/api/user/123')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })
  })
}
