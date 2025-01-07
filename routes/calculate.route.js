const express = require('express');
const router = express.Router();
const { calculate } = require('../controllers/calculate.controller');

router.post('/', calculate);

module.exports = router;
