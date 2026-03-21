const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public route for exchanging Google authorization code
router.post('/google', authController.googleLogin);

// Public route for clearing the HTTP-Only cookie
router.post('/logout', authController.logout);

// Protected route to fetch current active profile or assert session health
router.get('/profile', requireAuth, authController.getProfile);

module.exports = router;
