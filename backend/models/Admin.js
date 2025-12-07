const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

const adminSchema = new mongoose.Schema({
  Admin_id: {
    type: String,
    unique: true
  },
  Username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  Password: {
    type: String,
    required: true
  },
  Role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Moderator'],
    default: 'Admin'
  },
  Email: String,
  Created_at: {
    type: Date,
    default: Date.now
  },
  Updated_at: {
    type: Date,
    default: Date.now
  },
  Last_login: Date
});

adminSchema.pre('save', async function(next) {
  if (!this.Admin_id) {
    const seq = await getNextSequence('admin');
    this.Admin_id = `AD${seq}`;
  }
  this.Updated_at = Date.now();
  next();
});

adminSchema.index({ Admin_id: 1 });
adminSchema.index({ Username: 1 });

module.exports = mongoose.model('Admin', adminSchema);

