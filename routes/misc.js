const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome on October API.')
})

module.exports = router;
