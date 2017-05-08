'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('config')
const winston = require('winston')

const { Book } = require('./models')
const { getRouter } = require('./routes')

winston.add(winston.transports.File, {
  filename: `logs/${process.env['NODE_ENV']}.log`
})

process.on('unhandledRejection', (error, promise) => {
  console.error('##### Unhandled Promise Rejection: #####')
  console.error((error && error.stack) || error)
  console.error(promise)
  throw error
})

// Don't show the log when in test env
if (process.env['NODE_ENV'] === 'test') {
  winston.remove(winston.transports.Console)
}

const winstonStream = {
  write: function(message, encoding) {
    winston.info(message)
  }
}

const app = express()
app.use(morgan('combined', { stream: winstonStream }))

// Parse application/json and look for raw text
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.use(getRouter())

const port = config.port
app.listen(port)
winston.info('Listening on port ' + port)

module.exports = app // for testing
