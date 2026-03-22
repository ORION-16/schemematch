const express = require('express');
const router = express.Router();
const { getAllSchemes, matchSchemes } = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.post('/match', matchSchemes);

module.exports = router;
