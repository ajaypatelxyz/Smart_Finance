const express = require('express');
const Investment = require('../models/Investment');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

// Get all investments
router.get('/', async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id }).sort({ purchaseDate: -1 });
        res.json(investments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching investments' });
    }
});

// Add investment
router.post('/', async (req, res) => {
    try {
        const investment = await Investment.create({ ...req.body, user: req.user.id });
        res.status(201).json(investment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding investment' });
    }
});

// Update investment
router.put('/:id', async (req, res) => {
    try {
        const investment = await Investment.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        res.json(investment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating investment' });
    }
});

// Delete investment
router.delete('/:id', async (req, res) => {
    try {
        await Investment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: 'Investment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting investment' });
    }
});

// Get portfolio summary
router.get('/portfolio', async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id });
        const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
        const currentValue = investments.reduce((s, i) => s + i.currentValue, 0);
        const returns = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100).toFixed(2) : 0;
        res.json({ totalInvested, currentValue, returns: parseFloat(returns), count: investments.length });
    } catch (error) {
        res.status(500).json({ message: 'Error getting portfolio' });
    }
});

module.exports = router;
