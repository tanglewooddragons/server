const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('register', () => {
    test('Fails to register with missing data', (done) => {
      request(app)
        .post('/api/register')
        .send({
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .expect(422)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })
    test('Fails to register when data is NOT valid', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          username: 'tester',
          password: 't',
          passwordRepeat: 't',
        })
        .expect(422)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    test('Fails to register if passwords do NOT match', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'tstetes',
        })
        .expect(400)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    test('Registers when everything is ok', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .expect(201)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    test('Fails to register when email is taken', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .expect(403)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    test('Should register properly using another email', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'test2@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .expect(201)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })
  })
}
