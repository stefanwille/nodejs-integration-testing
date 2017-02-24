process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect

const { resetDatabase, syncDatabase, Book } = require('../src/models')

describe('Book', function() {
  before(function(done) {
    syncDatabase()
    .then(function() {
      done()
    })
    .catch(function(error) {
      done(error)
    })
  })

  beforeEach(function(done) {
    resetDatabase()
    .then(function() {
      done()
    })
    .catch(function(error) {
      done(error)
    })
  })

  describe('save and find', function() {
    it('works', function(done) {
      Book.create({author: 'Ben Bekler', title: 'Soy el Señor'})
      .then(function(createdBook) {
        expect(createdBook.author).to.equal('Ben Bekler')
        expect(createdBook.title).to.equal('Soy el Señor')
        Book.findOne()
        .then(function(foundBook) {
          expect(foundBook.author).to.equal('Ben Bekler')
          expect(foundBook.title).to.equal('Soy el Señor')
          expect(foundBook.id).to.equal(createdBook.id)
          done()
        })
      })
    })
  })

  describe('where', function() {
    it('finds only rows for the given condition', function(done) {
      Promise.all([
          Book.create({author: 'AAA', title: 'BBB'}),
          Book.create({author: 'CCC', title: 'DDD'})
        ])
      .then(function() {
        return Book.count()
      })
      .then(function(bookCount) {
        expect(bookCount).to.equal(2)
        return Book.findAll({where: { author: 'CCC' } })
      })
      .then(function(books) {
        expect(books.length).to.equal(1)
        done()
      })
      .catch(function(error) {
        done(error)
      })
    })
  })

  describe('validation', function() {
    it('finds invalid attributes', function(done) {
      Book.create({author: null, title: 'Soy el Señor'})
      .then(function(createdBook) {
        done(new Error('Should raise a validation error'))
      })
      .catch(function(error) {
        expect(error.errors).to.deep.equal([ { message: 'author cannot be null',
          type: 'notNull Violation',
          path: 'author',
          value: null } ]
        )
        done()
      })
    })
  })
})
