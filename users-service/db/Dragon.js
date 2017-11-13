const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

const db = require('./')
const User = require('./User')

const Dragon = db.define('dragon', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: uuid()
  },
  ownerId: {
    type: Sequelize.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },

  gender: Sequelize.ENUM('MALE', 'FEMALE'),
  born: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  bgImage: Sequelize.STRING,

  aspect: Sequelize.STRING,
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },

  fed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  isBusy: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  currentTask: Sequelize.STRING,
  currentTaskEnd: Sequelize.DATE,

  stats: {
    type: Sequelize.JSON,
    defaultValue: {
      "con": 0,
      "int": 0,
      "str": 0,
      "agl": 0,
      "wlp": 0,
      "lck": 0,
    },
  },
})

module.exports = Dragon
