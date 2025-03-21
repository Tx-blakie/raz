const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '30d',
  });
};

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@agroconnect.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const adminUser = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin@123',
        phone: '1234567890',
        userType: 'admin',
        isAdmin: true,
        location: {
          pincode: '000000',
          state: 'Admin State',
          district: 'Admin District',
          address: 'Admin Address'
        },
        documents: {} // Admin doesn't need documents
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Call createAdminUser when the server starts
createAdminUser();

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      userType,
      pincode,
      state,
      district,
      taluka,
      address,
      panCard,
      cancelledCheque,
      agricultureCertificate,
      gstNumber
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with proper structure
    const userData = {
      name,
      email,
      phone,
      password,
      userType,
      location: {
        pincode,
        state,
        district,
        taluka: taluka || '',
        address
      },
      documents: {
        panCard,
        cancelledCheque: cancelledCheque || '',
        agricultureCertificate: agricultureCertificate || '',
        gstNumber: gstNumber || ''
      }
    };

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        location: user.location,
        isAdmin: user.isAdmin,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  getUserProfile
}; 