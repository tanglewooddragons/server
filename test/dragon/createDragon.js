const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('createDragon', () => {
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

    it('Fails to register with missing name', (done) => {
      request(app)
        .post('/api/dragon/create')
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    it('Creates dragon with proper data provided', (done) => {
      request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    it('Sets current user as dragon owner', (done) => {
      request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.owner, user.id, 'It didnt assigned correct id')
          done()
        })
    })
  })
}
