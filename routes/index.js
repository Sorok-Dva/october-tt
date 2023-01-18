const express = require('express');

const brandRouter = require('./brand');
const miscRouter = require('./misc');

const router = express.Router();

router.use('/brand', brandRouter);
router.use('/', miscRouter);


module.exports = router;
