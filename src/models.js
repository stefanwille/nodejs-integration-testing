const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres://stefan:@localhost:5432/sequelize_development');

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
});

function resetDatabase() {
  sequelize.sync()
}

module.exports = {
  resetDatabase,
  Book
}
