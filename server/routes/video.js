const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { generateVideo } = require('../controllers/videoController');

const upload = require('../middleware/uploadMiddleware');
const Video = require('../models/Video');  // Adjust the path as necessary

router.post('/generate-video', authenticateToken, upload, generateVideo);


// Add a route to fetch all videos for a user
router.get('/videos', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;  // Assuming you have user ID available from the authentication token
        const videos = await Video.find({ userId }).sort({ createdAt: -1 });  // Fetch all videos of the user, sorted by creation date
        res.json(videos);
    } catch (error) {
        console.error('Failed to fetch videos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
