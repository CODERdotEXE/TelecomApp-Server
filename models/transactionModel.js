// server/models/transactionModel.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: Number, // Change type to Number
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  planValue: {
    type: Number, // Add a new field for plan value
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
