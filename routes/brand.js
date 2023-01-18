const { Brand } = require('../components');
const { HTTPValidation } = require('../middlewares');
const express = require('express');

const router = express.Router();

router.post('/search', HTTPValidation.Brand.Search, Brand.Search)

module.exports = router;
