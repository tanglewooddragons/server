const chai = require('chai')
const request = require('supertest')

const { assert } = chai

module.exports = function (app) {
  describe('feedDragon', () => {
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
  })
}
