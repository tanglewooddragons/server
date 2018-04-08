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
    beforeAll((done) => {
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

    test('Fails to register with missing name', (done) => {
      request(app)
        .post('/api/dragon/create')
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
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
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    test('Sets current user as dragon owner', (done) => {
      request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.owner, user.id, 'It didnt assigned correct id')
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
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })
  })
}
