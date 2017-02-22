const config = require('config')
const Sequelize = require('sequelize')

const databaseUrl = config.databaseUrl
const sequelize = new Sequelize(databaseUrl)

const Book = sequelize.define('books', {
  title: {
    type: Sequelize.STRING,
    field: 'title'
  },
  author: {
    type: Sequelize.STRING,
    field: 'author'
  }
}, {
  freezeTableName: true
})

function resetDatabase() {
  return Book.destroy({where: {}})
}

module.exports = {
  resetDatabase,
  Book
}
