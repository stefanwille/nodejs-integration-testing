process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const server = require('../src/server')

chai.use(chaiHttp)

describe('/books', function() {
  describe('GET /', function() {
    it('works', function() {
      expect(3).to.equal(4)
    })
  })
})

