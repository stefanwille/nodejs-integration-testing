'use strict'

const express = require('express')
const R = require('ramda')
const { Book } = require('./models')

async function index(request, response) {
  const books = await Book.findAll({
    attributes: ['title', 'author'],
  })
  response.json({ books: books })
}

async function show(request, response) {
  const id = request.params.id
  const book = await Book.findById(id, { attributes: ['title', 'author'] })
  if (book) {
    response.json({ book: book })
  } else {
    response.status(404).json({ error: 'NOT_FOUND' })
  }
}

async function create(request, response) {
  const attributes = R.pick(['title', 'author'], request.body.book)
  const book = await Book.create(attributes)
  if (book) {
    response.json({ book })
  } else {
    response.status(500)
  }
}

async function update(request, response) {
  const book = await Book.findById(request.params.id)
  if (!book) {
    response.status(404)
    return
  }

  const attributes = R.pick(['title', 'author'], request.body.book)
  Object.assign(book, attributes)
  await book.save()
  response.json({ book })
}

async function destroy(request, response) {
  const book = await Book.findById(request.params.id)
  if (!book) {
    response.status(404)
    return
  }

  await book.destroy()
  response.json({})
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
  getRouter,
}
