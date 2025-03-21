const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    userType: {
      type: String,
      enum: ['farmer', 'buyer', 'helper', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active'
    },
    location: {
      pincode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      taluka: {
        type: String,
      },
      address: {
        type: String,
        required: true,
      },
    },
    documents: {
      panCard: {
        type: String,
        required: function() {
          return !this.isAdmin && this.userType !== 'admin';
        },
      },
      cancelledCheque: {
        type: String,
        required: function() {
          return this.userType === 'farmer';
        },
      },
      agricultureCertificate: {
        type: String,
        required: function() {
          return this.userType === 'helper';
        },
      },
      gstNumber: {
        type: String,
        required: function() {
          return this.userType === 'buyer';
        },
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User; 