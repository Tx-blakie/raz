const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Commodity = require('../models/commodityModel');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/adminController');

// All routes are protected and require admin access
router.use(protect, admin);

// Get all users with role filter
router.get('/users', async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role && role !== 'all') {
            query.userType = role;
        }
        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user status
router.patch('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all commodities with filters
router.get('/commodities', async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (type && type !== 'all') {
            query.commodityType = type;
        }
        const commodities = await Commodity.find(query)
            .populate('farmer', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(commodities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update commodity status
router.patch('/commodities/:commodityId/status', async (req, res) => {
    try {
        const { commodityId } = req.params;
        const { status, rejectionReason } = req.body;
        
        const updateData = { status };
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        
        const commodity = await Commodity.findByIdAndUpdate(
            commodityId,
            updateData,
            { new: true }
        ).populate('farmer', 'name email phone');
        
        if (!commodity) {
            return res.status(404).json({ message: 'Commodity not found' });
        }
        
        res.json(commodity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get dashboard statistics
router.get('/statistics', async (req, res) => {
    try {
        const stats = {
            users: {
                total: await User.countDocuments(),
                farmers: await User.countDocuments({ userType: 'farmer' }),
                buyers: await User.countDocuments({ userType: 'buyer' }),
                helpers: await User.countDocuments({ userType: 'helper' })
            },
            commodities: {
                total: await Commodity.countDocuments(),
                pending: await Commodity.countDocuments({ status: 'pending' }),
                approved: await Commodity.countDocuments({ status: 'approved' }),
                rejected: await Commodity.countDocuments({ status: 'rejected' })
            }
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User management routes
router.get('/users/stats', getUserStats);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router; 