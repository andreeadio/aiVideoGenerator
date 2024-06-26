const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Audio = require('../models/Audio');
const { authenticateToken } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-audio', authenticateToken, upload.single('audio'), async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;
        const newAudio = new Audio({
            filename: `${uuidv4()}-${originalname}`,
            contentType: mimetype,
            data: buffer,
            userId: req.user.userId,
        });
        await newAudio.save();
        res.status(200).json({ message: 'Audio file uploaded successfully', audioId: newAudio._id });
    } catch (error) {
        console.error('Error uploading audio file:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = router;
