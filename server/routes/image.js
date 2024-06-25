
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { generateImage } = require('../controllers/imageController');

router.post('/generate-image', authenticateToken, generateImage);

module.exports = router;
