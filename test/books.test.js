process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const server = require('../src/server')

chai.use(chaiHttp)

describe('/books', function() {
  describe('GET /', function() {
    it('works', function(done) {
      chai.request(server)
        .get('/')
        .end(function(err, res) {
          if(err) {
            throw err
          }
          expect(res.body.books).to.eql([3, 4, 5])
          done()
        })
    })
  })
})
