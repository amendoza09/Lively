const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  city:{ type: String, required: true},
  title: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },  // Can also use Date if needed
  type: { type: String, required: true },
  description: { type: String},
  imageUrl: { type: String }, // Store image URL if using cloud storage
  feature: { type: Boolean, default: false },
  status: { type: String, default: "pending" },
  email: {type: String},
  phone: {type: String}
});

module.exports = mongoose.model("Event", eventSchema);