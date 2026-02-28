const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

// POST /api/register
router.post('/register', authController.register);

// POST /api/login
router.post('/login', loginLimiter, authController.login);

module.exports = router;
