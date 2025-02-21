const mongoose = require('mongoose');

const ApprovedAccountSchema = new mongoose.Schema({
    organicationName: {type: String, required: true },
    accountOwner: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    approvedAt: { type: Date, default: Date.now},
});

module.exports = mongoose.model('approved_accounts', ApprovedAccountSchema);