process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

const server = require('../src/server')
const { resetDatabase, Book } = require('../src/models')

chai.use(chaiHttp)

describe('/books', function() {
  before(function(done) {
    resetDatabase()
    .then(function() {
      done()
    })
    .catch(function(error) {
      done(error)
    })
  })

  describe('GET /books', function() {
    beforeEach(function(done) {
      Book.create({title: 'Some title', author: 'Algun author'})
      .then(function() {
        done()
      })
    })

    it('works', function(done) {
      chai.request(server)
        .get('/books')
        .end(function(error, response) {
          expect(error).to.be.null
          expect(response.body.books).to.deep.equal([{title: 'Some title', author: 'Algun author'}])
          done()
        })
    })
  })

  describe('GET /books/:id', function() {
    let book
    beforeEach(function(done) {
      Book.create({title: 'Other title', author: 'Other author'})
      .then(function(newBook) {
        book = newBook
        done()
      })
    })

    it('works', function(done) {
      chai.request(server)
        .get(`/books/${book.id}`)
        .end(function(error, response) {
          expect(error).to.be.null
          expect(response.body.book).to.deep.equal({title: 'Other title', author: 'Other author'})
          done()
        })
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
    it('works', function(done) {
      chai.request(server)
        .post('/books')
        .send({ book: {title: 'Creator title', author: 'Creator author'} })
        .end(function(error, response) {
          expect(error).to.be.null
          expect(response.body.book.id).not.to.be.null
          expect(response.body.book).to.deep.include({
            title: 'Creator title',
            author: 'Creator author'
          })
          Book.findById(response.body.book.id)
            .then(function(loadedBook) {
              expect(loadedBook).to.deep.include({
                title: 'Creator title',
                author: 'Creator author'
              })
              done()
            })
        })
    })
  })
})
