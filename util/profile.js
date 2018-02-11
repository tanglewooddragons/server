const request = require('supertest')
const spawn = require('child_process').spawn

// @TODO
// Create new account for profiling
// As of now we expect it to exist already
// email: test@test.com
// pass: test
const email = 'test@test.com'
const password = 'test'

const run = async () => {
  // Login to recieve token
  console.log('Fetching token..')
  const response = await request('http://localhost:8080')
    .post('/api/login')
    .send({
      email,
      password,
    })

  const token = response.body.token
  console.log('Got token')

  // Execute ApacheBench to get own profile
  console.log('Running ApacheBench..')
  const cmd = 'ab'
  const args = [
    '-H', `Authorization: Bearer ${token}`,
    '-c', '1000',
    '-n', '10000',
    'http://localhost:8080/api/user',
  ]

  const ab = spawn(cmd, args)

  ab.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  ab.on('exit', () => {
    console.log('Test completed, you can now close the server process')
    console.log('To process produced log file use')
    console.log('node --prof-process <file-name> > output.txt')
  })
}

run()
