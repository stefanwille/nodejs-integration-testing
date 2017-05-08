const config = require('config')
const Sequelize = require('sequelize')
const winston = require('winston')

const logToWinston = function(str) {
  winston.info(str)
}

const databaseUrl = config.databaseUrl
const sequelize = new Sequelize(databaseUrl, {
  logging: logToWinston,
  underscoredAll: true
})

const Book = sequelize.define(
  'books',
  {
    title: {
      type: Sequelize.STRING
    },

    author: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  }
)

function resetDatabase() {
  return Book.truncate()
}

function syncDatabase() {
  return Book.sync({ force: true })
}

module.exports = {
  resetDatabase,
  syncDatabase,
  Book
}
