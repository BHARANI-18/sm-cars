const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30m', // 30 minutes expiration
    });
};

// @desc    Auth admin / set cookie
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 30 * 60 * 1000, // Explicitly expires in exactly 30 minutes
            });

            res.status(200).json({
                _id: user._id,
                username: user.username,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 0, // maxAge 0 reliably forces the browser to delete the cookie immediately
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Seed initial admin user if it doesn't exist (useful for testing initialization)
const seedAdmin = async (req, res) => {
    try {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD;

        if (!password) {
            return res.status(500).json({ message: 'ADMIN_PASSWORD environment variable is not set.' });
        }

        const adminExists = await User.findOne({ username });

        if (adminExists) {
            return res.status(400).json({ message: `Admin '${username}' already exists` });
        }

        const admin = await User.create({ username, password });

        res.status(201).json({
            message: 'Admin created successfully',
            username: admin.username
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    loginUser,
    logoutUser,
    getMe,
    seedAdmin
};
