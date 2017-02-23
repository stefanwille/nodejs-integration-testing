process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect

const { resetDatabase, Book } = require('../src/models')

describe('Book', function() {
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
