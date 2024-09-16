const express = require('express');
const router = express.Router();
const beController = require('../controllers/beController');

router.get('/be', beController.be_get);
router.get('/kids', beController.kids_get);
router.get('/prompt', beController.prompt_get);
// router.post('/translate', beController.translate_toJP_post);

module.exports = router;