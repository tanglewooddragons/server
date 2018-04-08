const chai = require('chai')
const request = require('supertest')

const { assert } = chai

const { createDragon } = require('db/dragon')

module.exports = function (app) {
  describe('feedDragon', () => {
    /*
    Login to get token
    */
    let dragon
    let adultDragon
    let token
    beforeAll(async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'test@test.com',
          password: 'test',
        })
        .then((res) => {
          token = res.body.token
        })

      // Create dragon
      await request(app)
        .post('/api/dragon/create')
        .send({
          name: 'Geoff',
          aspect: 'fire',
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          dragon = res.body
        })

      // Create adult dragon
      adultDragon = await createDragon({
        name: 'Alaz',
        gender: 'male',
        owner: dragon.owner,
        aspect: 'fire',
        level: 23,
      })
    })

    test('Does not modify dragon statistics when its still egg', (done) => {
      request(app)
        .post(`/api/dragon/feed/${dragon.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.id, dragon.id, 'Returns wrong dragon')

          const stats = Object
            .values(res.body.stats)
            .reduce((acc, val) => {
              acc += val
              return acc
            }, 0)

          assert.equal(stats, 0, 'It add statisctics to egg')
          done()
        })
    })

    test('Fails to feed when type of food is invalid', (done) => {
      request(app)
        .post(`/api/dragon/feed/${adultDragon.id}`)
        .send({
          food: 'Watermelon',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end((err) => {
          assert.isNotOk(err, 'Request returned error')
          done()
        })
    })

    test('Updates dragon statistics properly', (done) => {
      request(app)
        .post(`/api/dragon/feed/${adultDragon.id}`)
        .send({
          food: 'meat',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          assert.isNotOk(err, 'Request returned error')
          assert.equal(res.body.fed, true, 'It didnt set dragon status as fed')
          assert.equal(res.body.stats.str, 2, 'It didnt update the stats')
          done()
        })
    })

    test('Fails to feed dragon when it has already been fed', (done) => {
      request(app)
        .post(`/api/dragon/feed/${adultDragon.id}`)
        .send({
          food: 'meat',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .end(() => {
          done()
        })
    })
  })
}
