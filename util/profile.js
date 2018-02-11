const request = require('supertest')
const execSync = require('child_process').execSync

// @TODO
// Create new account for profiling
// As of now we expect it to exist already
// email: test@test.com
// pass: test
const email = 'test@test.com'
const password = 'test'

const run = async () => {
  // Login to recieve token
  const response = await request('http://localhost:8080')
    .post('/api/login')
    .send({
      email,
      password,
    })

  const token = response.body.token

  // Execute ApacheBench to get own profile
  console.log('Running ApacheBench..')
  const cmd = `ab -H 'Authorization: Bearer ${token}' -c 1000 -n 10000 http://localhost:8080/api/user`
  execSync(cmd)
  console.log('Test completed, you can now close the server process')
  console.log('To process produced log file use')
  console.log('node --prof-process <file-name> > output.txt')
}

run()
