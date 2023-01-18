const { ErrorHandler, Express } = require('./middlewares')
const express = require('express')
const logger = require('morgan')

const routes = require('./routes/index')
const app = express()

app.set('env', process.env.ENV)
app.use(logger('dev'))

app.use(express.json({ limit: '150mb' }))
app.use(Express.methodOverride)
app.use(Express.helmet)

app.use('/', routes)

app.use(ErrorHandler.notFoundError)
app.use(ErrorHandler.converter)
app.use(ErrorHandler.api)

module.exports = app
