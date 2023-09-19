// server/models/profileModel.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  // Add other fields as needed
});

module.exports = mongoose.model('Profile', profileSchema);