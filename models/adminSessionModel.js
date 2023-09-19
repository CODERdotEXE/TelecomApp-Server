const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema({
  username: String,
  email: String,
  loginTime: Date,
  logoutTime: Date,
  sessionDuration: String,
  ipAddress: String, // Add the ipAddress field to store the IP address
});

module.exports = mongoose.model('AdminSession', adminSessionSchema);
