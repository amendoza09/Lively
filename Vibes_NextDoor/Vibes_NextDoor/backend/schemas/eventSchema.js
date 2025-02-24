const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: false },
  city: { type: String, required: true},
  date: { type: Date, required: true },
  time: { type: Date, required: true },  // Can also use Date if needed
  type: { type: String, required: true },
  imageUrl: { type: String }, // Store image URL if using cloud storage
  feature: { type: Boolean, default: false },
});

module.exports = mongoose.model('Event', eventSchema);