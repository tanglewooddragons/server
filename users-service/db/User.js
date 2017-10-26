const Sequelize = require('sequelize')
const db = require('./')

const Dragon = require('./Dragon')

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },

  username: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: Sequelize.STRING,
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  registrasionDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },

  avatar: Sequelize.STRING,
  backgroundPicture: Sequelize.STRING,
  country: Sequelize.STRING,
  dateOfBirth: Sequelize.DATE,
  bio: Sequelize.STRING,

  premium: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user',
  },


  silver: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  sapphires: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  items: {
    type: Sequelize.JSON,
    defaultValue: {
      "ingredients": [],
      "items": []
    },
  },
})

User.hasMany(Dragon, { as: 'dragons', foreignKey: 'ownerId' })
Dragon.belongsTo(User, { foreignKey: 'ownerId' })

module.exports = User
