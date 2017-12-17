const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('updateUser', async () => {
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

    it('Should update fields', (done) => {
      request(app)
        .put('/api/user')
        .send({
          profile: {
            country: 'Poland',
          },
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.profile.country, 'Poland', 'It did not update the field')
          done()
        })
    })

    it('Should NOT update secured fields', (done) => {
      request(app)
        .put('/api/user')
        .send({
          role: 'admin',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.deepEqual(res.body, {}, 'It updated secured field')
          done()
        })
    })
  })
}
