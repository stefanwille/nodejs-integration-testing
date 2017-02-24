process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

const server = require('../src/server')
const { resetDatabase, Book } = require('../src/models')

chai.use(chaiHttp)

describe('/books requests', function() {
  beforeEach(resetDatabase)

  describe('GET /books', function() {
    beforeEach(async function() {
      await Book.create({title: 'Some title', author: 'Algun author'})
    })

    it('works', async function() {
      const response = await chai.request(server)
        .get('/books')
      expect(response.body.books).to.deep.equal([{title: 'Some title', author: 'Algun author'}])
    })
  })

  describe('GET /books/:id', function() {
    let book
    beforeEach(async function() {
      book = await Book.create({title: 'Other title', author: 'Other author'})
    })

    it('works', async function() {
      const response = await chai.request(server)
        .get(`/books/${book.id}`)
      expect(response.body.book).to.deep.equal({title: 'Other title', author: 'Other author'})
    })

    it('returns status 404 when not found', function(done) {
      chai.request(server)
        .get('/books/12345')
        .end(function(error, response) {
          expect(error.message).to.equal('Not Found')
          expect(response.body).to.deep.equal({error: 'NOT_FOUND'})
          expect(response.status).to.equal(404)
          done()
        })
    })
  })

  describe('POST /books (= create)', function() {
    it('works', async function() {
      const response = await chai.request(server)
        .post('/books')
        .send({ book: {title: 'Creator title', author: 'Creator author'} })
      expect(response.body.book.id).not.to.be.null
      expect(response.body.book).to.deep.include({
        title: 'Creator title',
        author: 'Creator author'
      })
      const loadedBook = await Book.findById(response.body.book.id)
      expect(loadedBook).to.deep.include({
        title: 'Creator title',
        author: 'Creator author'
      })
    })
  })

  describe('PATCH /books/:id (= update)', function() {
    let book
    beforeEach(async function() {
      book = await Book.create({title: 'Original title', author: 'Original author'})
    })

    it('works', async function() {
      const response = await chai.request(server)
        .patch(`/books/${book.id}`)
        .send({ book: {title: 'Updated title'} })
      expect(response.status).to.equal(200)
      expect(response.body.book).to.deep.include({
        title: 'Updated title',
        author: 'Original author'
      })
      await book.reload()
      expect(book).to.deep.include({
        title: 'Updated title',
        author: 'Original author'
      })
    })
  })

  describe('DELETE /books/:id (= destroy)', function() {
    let book
    beforeEach(async function() {
      book = await Book.create({title: 'Original title', author: 'Original author'})
    })

    it('works', async function() {
      const response = await chai.request(server)
        .delete(`/books/${book.id}`)
        .send({ book: {title: 'Updated title'} })
      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equal({})
      const loadedBook = await Book.findById(book.id)
      expect(loadedBook).to.be.null
    })
  })
})
