const express = require('express');
const router = express.Router();
const beController = require('../controllers/beController');

router.get('/be', beController.be_get);

module.exports = router;