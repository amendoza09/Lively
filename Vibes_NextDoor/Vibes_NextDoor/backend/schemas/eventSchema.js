const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  city:{ type: String, required: true},
  title: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String},
  image: { type: String},
  feature: { type: Boolean, default: false },
  email: { type: String },
  phone: { type: String },
  restrictions: { type: String },
  createdAt: { type: Date, default: Date.now },
  link: { type: String },
});

module.exports = mongoose.model("Event", eventSchema);