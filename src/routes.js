const express = require('express')
const R = require('ramda')
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

function update(request, response) {
  let updatedBook
  Book.findById(request.params.id)
    .then(function(book) {
      if (!book) {
        response.status(404)
        return
      }

      const attributes = R.pick(['title', 'author'], request.body.book)
      Object.assign(book, attributes)
      updatedBook = book
      return book.save()
    })
    .then(function() {
      response.json({book: updatedBook})
    })
}

function destroy(request, response) {
  Book.findById(request.params.id)
    .then(function(book) {
      if (!book) {
        response.status(404)
        return
      }

      return book.destroy()
    })
    .then(function() {
      response.json({})
    })
}

function getRouter() {
  const router = express.Router()
  router.get('/books', index)
  router.get('/books/:id', show)
  router.post('/books', create)
  router.patch('/books/:id', update)
  router.delete('/books/:id', destroy)
  return router
}

module.exports = {
  getRouter
}
