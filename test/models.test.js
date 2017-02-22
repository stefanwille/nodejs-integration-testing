process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect

const { resetDatabase, Book } = require('../src/models')

describe('Book', function() {
  before(function(done) {
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
      Book.create({author: 'Ben Bekler', title: 'Soy el Señor'}).
      then(function(createdBook) {
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
})
