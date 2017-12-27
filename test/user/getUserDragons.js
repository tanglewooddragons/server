const chai = require('chai')
const request = require('supertest')

const { assert } = chai

const Dragon = require('../../src/db/models/dragon')

module.exports = function (app) {
  describe('getUserDragons', async () => {
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

      // Create test dragons
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

    it('Returns dragons properly', (done) => {
      request(app)
        .get(`/api/user/dragons/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.length, 2, 'Returns wrong amount of dragons')
          assert.equal(res.body[0].owner, user.id, 'Returns wrong user dragons')
          done()
        })
    })

    it('Returns dragons from current user when no id provided', (done) => {
      request(app)
        .get('/api/user/dragons')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body[0].owner, user.id, 'Returns wrong user dragons')
          done()
        })
    })
  })
}
