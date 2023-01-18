const { check } = require('express-validator');
const HTTPValidation = {};

/**
 * HTTPValidation: Brand.Search Method
 * Checks:
 *      - @search exists, is string
 * @type {ValidationChain[]}
 */
HTTPValidation.Search = [
  check('brand').exists().isString().withMessage('Brand search term cannot be empty.'),
];

module.exports = HTTPValidation;
