const express = require('express');
const router = express.Router();
const { getShortUrl } = require('./controller');

router.post('/getShortUrl', getShortUrl);

module.exports = router;
