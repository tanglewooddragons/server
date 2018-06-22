const request = require('supertest')

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
          expect(err).toBeNull()
          done()
        })
    })

    test('Fails to register when data is NOT valid', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'registertest@test.com',
          username: 'tester',
          password: 't',
          passwordRepeat: 't',
        })
        .expect(422)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })

    test('Fails to register if passwords do NOT match', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'registertest@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'tstetes',
        })
        .expect(400)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })

    test('Registers when everything is ok', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'registertest@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .expect(201)
        .end((err) => {
          expect(err).toBeNull()
          done()
        })
    })

    test('Fails to register when email is taken', (done) => {
      request(app)
        .post('/api/register')
        .send({
          email: 'registertest@test.com',
          username: 'tester',
          password: 'test',
          passwordRepeat: 'test',
        })
        .expect(403)
        .end((err) => {
          expect(err).toBeNull()
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
          expect(err).toBeNull()
          done()
        })
    })
  })
}
