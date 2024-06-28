const express = require('express');
const router = express.Router();
const { generateDescriptions } = require('../controllers/descriptionController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

router.post('/generate-descriptions', authenticateToken, generateDescriptions);

module.exports = router;
