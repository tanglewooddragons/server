const request = require('supertest')

module.exports = function (app) {
  describe('sendOnTask', () => {
    let user
    let token

    beforeAll(async () => {
      user = await global.login(app)
      token = user.accessToken
    })

    test('Fails to send on task when duration is off limits', (done) => {
      request(app)
        .post('/api/dragon/task')
        .send({
          dragonId: user.dragons[0].id,
          duration: 13,
          location: 'Eastern Desert',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.error).toBeTruthy()
          done()
        })
    })

    test('Fails to send on task when location is invalid', (done) => {
      request(app)
        .post('/api/dragon/task')
        .send({
          dragonId: user.dragons[0].id,
          duration: 1,
          location: 'Trash Can',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.error).toBeTruthy()
          done()
        })
    })

    test('Send on task successfully when data is correct', (done) => {
      request(app)
        .post('/api/dragon/task')
        .send({
          dragonId: user.dragons[0].id,
          duration: 2,
          location: 'Sword Coast',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull()
          expect(res.body.startTime).toBeDefined()
          expect(res.body.endTime).toBeDefined()
          done()
        })
    })
  })
}
