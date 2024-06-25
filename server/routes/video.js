const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { generateVideo } = require('../controllers/videoController');

router.post('/generate-video', authenticateToken, generateVideo);

module.exports = router;
