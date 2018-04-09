const request = require('supertest')

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
          expect(err).toBeNull()
          expect(res.body.id).toBe(dragon.id)

          const stats = Object
            .values(res.body.stats)
            .reduce((acc, val) => {
              acc += val
              return acc
            }, 0)

          expect(stats).toBe(0)
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
          expect(err).toBeNull()
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
          expect(err).toBeNull()
          expect(res.body.fed).toBe(true)
          expect(res.body.stats.str).toBe(2)
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
