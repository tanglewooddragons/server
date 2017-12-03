const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('#register', () => {
    it('Fails to register with missing data', (done) => {
      request(app)
        .post('/api/register')
        .send({
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.status, 400, 'Returns invalid status')
          done()
        })
    })
    it('Fails to register when data is NOT valid', (done) => {
      request(app)
        .post('/api/register')
        .send({
          username: 'tester',
          password: 't',
          passwordRepeat: 't',
        })
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.status, 400, 'Returns invalid status')
          done()
        })
    })

    it('Fails to register if passwords do NOT match', (done) => {
      request(app)
        .post('/api/register')
        .send({
          username: 'tester',
          password: 'test',
          passwordRepeat: 'tstetes',
        })
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.status, 400, 'Returns invalid status')
          done()
        })
    })

    it('Registers when everything is ok', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.status, 201, 'Returns invalid status')
          done()
        })
    })

    it('Fails to register when email is taken', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.status, 403, 'Returns invalid status')
          done()
        })
    })
  })
}
