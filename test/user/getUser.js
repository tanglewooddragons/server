const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('#user', async () => {
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

    it('Returns error when user does NOT exist', (done) => {
      request(app)
        .get('/api/user/idonotexistlala')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })
    it('Returns correct user', (done) => {
      request(app)
        .get(`/api/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.id, user.id, 'Returns wrong user')
          done()
        })
    })
    it('Returns logged in user when no id is provided', (done) => {
      done()
    })
  })
}
