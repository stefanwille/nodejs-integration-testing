const config = require('config')
const Sequelize = require('sequelize')

const databaseUrl = config.databaseUrl
const sequelize = new Sequelize(databaseUrl)

const Book = sequelize.define('books', {
  title: {
    type: Sequelize.STRING
  },

  author: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true
})

function resetDatabase() {
  return Book.truncate()
}

module.exports = {
  resetDatabase,
  Book
}
