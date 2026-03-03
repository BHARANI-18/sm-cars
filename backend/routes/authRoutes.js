const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

// Temporarily useful mapping to seed an initial admin account
router.post('/seed', seedAdmin);

module.exports = router;
