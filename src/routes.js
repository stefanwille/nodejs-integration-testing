const { Book } = require('./models')

function index(request, response) {
  Book.findAll({
    attributes: ['title', 'author']
  }).then(function(books) {
    response.json({books: books})
  })
}

function show(request, response) {
  const id = request.params.id
  Book.findById(id, {attributes: ['title', 'author']}).then(function(book) {
    if (book) {
      response.json({book: book})
    } else {
      response.status(404).json({error: 'NOT_FOUND'})

    }
  })
}

function addRoutes(app) {
  app.get('/books', index);
  app.get('/books/:id', show);
}

module.exports = {
  addRoutes
}
