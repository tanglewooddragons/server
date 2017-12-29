const chai = require('chai')
const request = require('supertest')

const { assert } = chai

const Dragon = require('../../src/db/models/dragon')

module.exports = function (app) {
  describe('getUser', async () => {
    /*
    Login to get token
    */
    let user
    let token
    before(async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })

      user = response.body
      token = response.body.token

      const d1 = new Dragon({
        name: 'Jeff',
        gender: 'male',
        owner: user.id,
        aspect: 'light',
      })

      const d2 = new Dragon({
        name: 'Geoff',
        gender: 'male',
        owner: user.id,
        aspect: 'earth',
      })

      await d1.save()
      await d2.save()
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
      request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.id, user.id, 'Returns wrong user')
          done()
        })
    })

    it('Returns dragons', (done) => {
      request(app)
        .get(`/api/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.dragons.length, 2, 'Returns wrong amount of dragons')
          assert.equal(res.body.dragons[0].owner, user.id, 'Returns wrong user dragons')
          done()
        })
    })
  })
}
