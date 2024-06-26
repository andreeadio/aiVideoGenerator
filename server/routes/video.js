const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { generateVideo } = require('../controllers/videoController');

const upload = require('../middleware/uploadMiddleware');

router.post('/generate-video', authenticateToken, upload, generateVideo);

module.exports = router;
