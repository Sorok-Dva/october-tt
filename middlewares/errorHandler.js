const httpStatus = require('http-status');
const { BackError } = require('../helpers/back.error');

const sendError = (req, res, status, err) => {
  if (res.headersSent) return
  err.status = status
  if (process.env.ENV === 'production') delete err.stack

  return res.status(status).json({ error: err })
};

module.exports = {
  notFoundError: (req, res, next) => next(new BackError('Page not found', httpStatus.NOT_FOUND)),
  converter: (err, req, res, next) => {
    if (!(err instanceof BackError)) return next(new BackError(err.message, err.status, err))

    return next(err)
  },
  api: (err, req, res, next) => {
    let status = err.status || err.statusCode || 500
    if (status < 400) status = 500

    if (err instanceof BackError && status >= 500) return sendError(req, res, status, err)

    const body = { status }

    // show the stacktrace when not in production
    if (process.env.ENV !== 'production') {
      body.stack = err.stack
    }

    if (status >= 500) {
      body.message = httpStatus[status]
      return sendError(req, res, status, body)
    }

    body.message = err.message

    if (err.code) body.code = err.code
    if (err.name) body.name = err.name
    if (err.type) body.type = err.type
    if (err.errors) body.errors = err.errors

    return sendError(req, res, status, body)
  }
}
