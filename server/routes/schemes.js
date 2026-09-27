const express = require('express');
const router = express.Router();
const { getAllSchemes, matchSchemes, searchSchemes } = require('../controllers/schemeController');

const aiController = require('../controllers/aiController');



router.get('/', getAllSchemes);
router.get('/search', searchSchemes);
router.post('/match', matchSchemes);
router.post('/ai-match', aiController.aiMatch);

module.exports = router;
