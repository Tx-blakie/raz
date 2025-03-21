const express = require('express');
const router = express.Router();
const Commodity = require('../models/commodityModel');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Upload image
router.post('/upload', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new commodity
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.userType !== 'farmer') {
            return res.status(403).json({ message: 'Only farmers can add commodities' });
        }

        const commodity = new Commodity({
            ...req.body,
            farmer: req.user._id,
            status: 'pending'
        });

        await commodity.save();
        res.status(201).json(commodity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get farmer's commodities
router.get('/farmer', protect, async (req, res) => {
    try {
        if (req.user.userType !== 'farmer') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const commodities = await Commodity.find({ farmer: req.user._id })
            .sort({ createdAt: -1 });
        res.json(commodities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get approved commodities for marketplace
router.get('/marketplace', async (req, res) => {
    try {
        const { type, search, minPrice, maxPrice } = req.query;
        let query = { status: 'approved' };

        if (type && type !== 'all') {
            query.commodityType = type;
        }

        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            query.pricePerUnit = {};
            if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
            if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
        }

        const commodities = await Commodity.find(query)
            .populate('farmer', 'name location')
            .sort({ createdAt: -1 });
        res.json(commodities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update commodity
router.patch('/:id', protect, async (req, res) => {
    try {
        const commodity = await Commodity.findById(req.params.id);
        if (!commodity) {
            return res.status(404).json({ message: 'Commodity not found' });
        }

        // Only farmer who created the commodity or admin can update it
        if (commodity.farmer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this commodity' });
        }

        // If user is not admin, they can only update certain fields
        let updateData = req.body;
        if (!req.user.isAdmin) {
            const { inStock, pricePerUnit, quantity, description } = req.body;
            updateData = { inStock, pricePerUnit, quantity, description };
        }

        const updatedCommodity = await Commodity.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('farmer', 'name location');

        res.json(updatedCommodity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete commodity
router.delete('/:id', protect, async (req, res) => {
    try {
        const commodity = await Commodity.findById(req.params.id);
        if (!commodity) {
            return res.status(404).json({ message: 'Commodity not found' });
        }

        // Only farmer who created the commodity or admin can delete it
        if (commodity.farmer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this commodity' });
        }

        await commodity.remove();
        res.json({ message: 'Commodity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 