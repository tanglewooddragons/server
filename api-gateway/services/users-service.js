const request = require('request-promise-native')
const baseUri = require('../routes')[process.env.NODE_ENV || 'development']

const usersBaseUri = `${baseUri['users-service'].target}/users` 

const login = async (body) => {
  const options = {
    method: 'POST',
    uri: `${usersBaseUri}/login`,
    body,
    json: true
  }

  return request(options)
    .catch(e => ({ statusCode: e.statusCode, error: e.error }))
}

const createUser = async (body) => {
  const options = {
    method: 'POST',
    uri: `${usersBaseUri}/create`,
    body,
    json: true
  }

  return request(options)
    .catch(e => ({ statusCode: e.statusCode, error: e.error }))
}

const deleteUser = async (body) => {
  const options = {
    method: 'DELETE',
    uri: `${usersBaseUri}/user/${body.id}`,
    body: body.user,
    json: true
  }

  return request(options)
    .catch(e => ({ statusCode: e.statusCode, error: e.error }))
}

module.exports = {
  login,
  createUser,
  deleteUser
}
