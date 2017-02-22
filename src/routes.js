const { Book } = require('./models')

function index(request, response) {
  Book.findAll({
    attributes: ['title', 'author']
  }).then(function(books) {
    response.json({books: books})
  })
}

function addRoutes(app) {
  app.get('/books', index);
}

module.exports = {
  addRoutes
}
