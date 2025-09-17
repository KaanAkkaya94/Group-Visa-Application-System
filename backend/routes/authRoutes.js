
const express = require('express');
const { registerUser, LoginFactory, updateUserProfile, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginFactory.getUser);
router.get('/profile', authMiddleware.protect, getProfile);
router.put('/profile', authMiddleware.protect, updateUserProfile);

module.exports = router;
