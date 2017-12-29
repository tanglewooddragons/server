const resolveTask = require('../dragon/actions/resolveTask')
const resolveTraining = require('../dragon/actions/resolveTraining')

const resolvers = {
  task: resolveTask,
  training: resolveTraining,
}

function getResolver(type) {
  return resolvers[type]
}

module.exports = getResolver
