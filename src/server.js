const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('config')

const { Book } = require('./models')
const { getRouter } = require('./routes')

const app = express()

// Don't show the log when in test env
if(process.env['NODE_ENV'] !== 'test') {
    // Use morgan to log to command line
    app.use(morgan('combined'))
}

// Parse application/json and look for raw text
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json'}))

app.use(getRouter())

const port = config.port
app.listen(port)
console.log('Listening on port ' + port)

module.exports = app  // for testing
