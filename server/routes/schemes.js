const express = require('express');
const router = express.Router();
const { getAllSchemes, matchSchemes, searchSchemes } = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.get('/search', searchSchemes);
router.post('/match', matchSchemes);

module.exports = router;
