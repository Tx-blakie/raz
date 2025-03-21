const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  getUserProfile
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').post(registerUser);
router.route('/login').post(loginUser);

// Protected routes
router.route('/profile').get(protect, getUserProfile);
router.route('/me').get(protect, getUserProfile);

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id').get(protect, admin, getUserById);

module.exports = router; 