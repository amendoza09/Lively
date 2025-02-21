const mongoose = require('mongoose');

const pendingAccountSchema = new mongoose.Schema({
    organizationName: { type: String, required: true, unique: true },
    accountOwner: { type: String, required: true },
    email: { type: String, required: true, unqiue: true },
    password: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pending_accounts', pendingAccountSchema);