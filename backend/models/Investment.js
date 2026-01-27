const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['mutual-fund', 'stocks', 'fd', 'gold', 'crypto', 'other'], required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
