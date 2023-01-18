const methodOverride = require('method-override');
const helmet = require('helmet');
const logger = require('morgan');

module.exports = {
  helmet: helmet(), // secure apps by setting various HTTP headers
  loggerDev: logger('dev'),
  methodOverride: methodOverride()
};