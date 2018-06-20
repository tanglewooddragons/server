require('dotenv').load()

const exec = require('child_process').exec
const path = require('path')

const dbPath = path.join(__dirname, '..')

const dbName = process.env.DB_DATABASE

const cmd = `docker run -d -p 28015:28015 -p 8090:8080 -v ${dbPath}:/data --name ${dbName} rethinkdb`

exec(cmd)
