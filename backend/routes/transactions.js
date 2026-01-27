const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const { type, category, month } = req.query;
        const filter = { user: req.user.id };
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (month) {
            const start = new Date(month + '-01');
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            filter.date = { $gte: start, $lte: end };
        }
        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// Add transaction
router.post('/', async (req, res) => {
    try {
        const transaction = await Transaction.create({ ...req.body, user: req.user.id });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error adding transaction' });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction' });
    }
});

// Get summary
router.get('/summary', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        res.json({ income, expenses, savings: income - expenses });
    } catch (error) {
        res.status(500).json({ message: 'Error getting summary' });
    }
});

module.exports = router;
