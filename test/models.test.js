process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect

const { resetDatabase, syncDatabase, Book } = require('../src/models')

describe('Book model', function() {
  before(syncDatabase)
  beforeEach(resetDatabase)

  describe('save and findOne', function() {
    it('works', async function() {
      const createdBook = await Book.create({ author: 'Ben Bekler', title: 'Soy el Señor' })
      expect(createdBook.author).to.equal('Ben Bekler')
      expect(createdBook.title).to.equal('Soy el Señor')
      const foundBook = await Book.findOne()
      expect(foundBook.author).to.equal('Ben Bekler')
      expect(foundBook.title).to.equal('Soy el Señor')
      expect(foundBook.id).to.equal(createdBook.id)
    })
  })

  describe('where', function() {
    it('finds only rows for the given condition', async function() {
      // eslint-disable-next-line  no-unused-vars
      const [book1, book2] = await Promise.all([
        Book.create({ author: 'AAA', title: 'BBB' }),
        Book.create({ author: 'CCC', title: 'DDD' }),
      ])
      const bookCount = await Book.count()
      expect(bookCount).to.equal(2)
      const books = await Book.findAll({ where: { author: 'CCC' } })
      expect(books.length).to.equal(1)
    })
  })

  describe('validation', function() {
    it('rejects invalid attributes', async function() {
      try {
        await Book.create({ author: null, title: 'Soy el Señor' })
        throw new Error('Should have raised a validation error')
      } catch (error) {
        expect(error.errors).to.deep.equal([
          {
            message: 'author cannot be null',
            type: 'notNull Violation',
            path: 'author',
            value: null,
          },
        ])
      }
    })
  })
})
