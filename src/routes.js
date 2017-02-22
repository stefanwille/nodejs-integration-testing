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

function create(request, response) {
  const attributes = {
    title: request.body.book.title,
    author: request.body.book.author
  }
  Book.create(attributes).then(function(book) {
    if (book) {
      response.json({book: book})
    } else {
      response.status(500)
    }
  })
}

function addRoutes(app) {
  app.get('/books', index)
  app.get('/books/:id', show)
  app.post('/books', create)
}

module.exports = {
  addRoutes
}
