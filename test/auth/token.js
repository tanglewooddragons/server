const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('#token', () => {
    it('Should recieve token on login', (done) => {
      request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.exists(res.body.token, 'Response does not contain token')
          done()
        })
    })

    /*
  Tests for integration token-user

  it('Should not be able to get resource without token', (done) => {
    request(app)
      .get('/api/users/user/1')
      .end((err, res) => {
        assert.isNotOk(err, 'Request returned error')
        assert.equal(res.status, 401, 'Returns invalid status')
        done()
      })
  })

  it('Should be able to get resource with valid token', (done) => {
    request(app)
      .get('/api/users/user/1')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        assert.isNotOk(err, 'Request returns error')
        assert.equal(res.status, 200, 'Returns invalid status')
        done()
      })
  })


  it('Should NOT be able to get resource with an old token', (done) => {
    request(app)
      .post('/api/login')
      .send({
        email: 'test@test.com',
        password: 'test'
      })
      .end(() => {
        request(app)
          .get('/users/user/1')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNotOk(err, 'Request returns error')
            assert.equal(res.status, 401, 'Returns invalid status')
            done()
          })
      })
   })
   */
  })
}
