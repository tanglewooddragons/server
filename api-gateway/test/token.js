const chai = require('chai')
const { assert } = chai
const request = require('supertest')

const server = require('../server')
const redis = require('../redis')

before(() => {
  redis.connect()
})

describe('#Token', () => {
  const app = server.listen(3000)
  let token

  it('Register an account', (done) => {
    request(app)
      .post('/register')
      .send({
        email: 'test@test.com',
        username: 'tester',
        password: 'test',
        passwordRepeat: 'test'
      })
      .end((err, res) => {
        assert.isNotOk(err, 'Request returned error')
        assert.equal(res.status, 200, 'Returns invalid status')
        done()
      })
  })

  it('Should recieve token on login', (done) => {
    request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'test'
      })
      .end((err, res) => {
        assert.isNotOk(err, 'Request returned error')
        assert.equal(res.status, 200, 'Returns invalid status')
        token = res.body.token
        done()
      })
  })

  it('Should not be able to get resource without token', (done) => {
    request(app)
      .get('/users/user/1')
      .end((err, res) => {
        assert.isNotOk(err, 'Request returned error')
        assert.equal(res.status, 401, 'Returns invalid status')
        done()
      })
  })

  it('Should be able to get resource with valid token', (done) => {
    request(app)
      .get('/users/user/1')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        assert.isNotOk(err, 'Request returns error')
        assert.equal(res.status, 200, 'Returns invalid status')
        done()
      })
  })

  it('Should NOT be able to get resource with an old token', (done) => {
    request(app)
      .post('/login')
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

  app.close()
})

after(() => {
  redis.disconnect()
})
