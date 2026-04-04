const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Full name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email address is required' });
        }
        if (!phone || !phone.trim()) {
            return res.status(400).json({ message: 'Mobile number is required' });
        }

        // Validate phone (at least 10 digits)
        const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '');
        if (digitsOnly.length < 10) {
            return res.status(400).json({ message: 'Please enter a valid mobile number (at least 10 digits)' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        const user = await User.create({ name: name.trim(), email: email.toLowerCase(), phone: phone.trim(), password });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email address is required' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'No account found with this email address' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password. Please try again.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, riskProfile: user.riskProfile } });
    } catch (error) {
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Get current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// Update profile
router.put('/profile', require('../middleware/auth'), async (req, res) => {
    try {
        const { name, phone, dob } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name.trim();
        if (phone !== undefined) user.phone = phone;
        if (dob !== undefined) user.dob = dob;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, dob: user.dob }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile. Please try again.' });
    }
});

// Change password
router.put('/change-password', require('../middleware/auth'), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({ message: 'Current password is required' });
        }
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to change password. Please try again.' });
    }
});

module.exports = router;
