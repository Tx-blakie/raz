const mongoose = require('mongoose');

const commoditySchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    commodityType: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other']
    },
    quantity: {
        type: Number,
        required: true,
        min: 10,
        max: 50
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Commodity', commoditySchema); 