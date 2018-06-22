const request = require('supertest')

global.login = async (app) => {
  const response = await request(app)
    .post('/api/login')
    .send({
      email: 'test@test.com',
      password: 'test',
    })

  return response.body
}
