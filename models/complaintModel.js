const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  applicationNumber: {
    type: Number,
    required: true,
    unique: true, 
  },
  complaintType: {
    type: String,
    required: true,
  },
  complaintDescription: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'Registered',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Complaint', complaintSchema);
