const exec = require('child_process').exec
const path = require('path')

const dbPath = path.join(__dirname, '..')

const cmd = `docker run -d -p 28015:28015 -p 8090:8080 -v ${dbPath}:/data --name tanglewood rethinkdb`

exec(cmd)
