const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { generateVideo } = require('../controllers/videoController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/generate-video', authenticateToken, upload.single('audio'), generateVideo);

module.exports = router;
