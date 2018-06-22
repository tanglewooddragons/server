const User = require('db/models/user')
const UserProfile = require('db/models/userProfile')
const LoginInfo = require('db/models/loginInfo')
const Dragon = require('db/models/dragon')
const DragonStatus = require('db/models/dragonStatus')
const Token = require('db/models/token')
const Schedule = require('db/models/schedule')
const ChatMessage = require('db/models/chatMessage')
const Message = require('db/models/message')
const Item = require('db/models/item')
const Location = require('db/models/location')

const cleanTable = async (Model) => {
  const entries = await Model.run()
  await Promise.all(entries.map(entry => entry.delete()))
}

const cleanDb = async () =>
  Promise.all([
    cleanTable(User),
    cleanTable(UserProfile),
    cleanTable(LoginInfo),
    cleanTable(Dragon),
    cleanTable(DragonStatus),
    cleanTable(Token),
    cleanTable(Schedule),
    cleanTable(ChatMessage),
    cleanTable(Message),
    cleanTable(Item),
    cleanTable(Location),
  ])

module.exports = cleanDb
