const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

module.exports = router;
