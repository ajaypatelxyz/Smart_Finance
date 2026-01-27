const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-finance';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected: localhost'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/investments', require('./routes/investments'));

// Serve specific HTML pages
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../frontend/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../frontend/register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dashboard.html')));
app.get('/transactions', (req, res) => res.sendFile(path.join(__dirname, '../frontend/transactions.html')));
app.get('/investments', (req, res) => res.sendFile(path.join(__dirname, '../frontend/investments.html')));
app.get('/insights', (req, res) => res.sendFile(path.join(__dirname, '../frontend/insights.html')));
app.get('/goals', (req, res) => res.sendFile(path.join(__dirname, '../frontend/goals.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '../frontend/profile.html')));
app.get('/settings', (req, res) => res.sendFile(path.join(__dirname, '../frontend/settings.html')));

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 1200;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
