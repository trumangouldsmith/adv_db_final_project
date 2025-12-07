const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

const eventSchema = new mongoose.Schema({
  Event_id: {
    type: String,
    unique: true
  },
  Name: {
    type: String,
    required: true
  },
  Description: String,
  Location: String,
  Date: {
    type: Date,
    required: true
  },
  Time: String,
  Capacity: Number,
  Organizer_id: {
    type: String,
    required: true
  },
  Created_at: {
    type: Date,
    default: Date.now
  },
  Updated_at: {
    type: Date,
    default: Date.now
  }
});

eventSchema.pre('save', async function(next) {
  if (!this.Event_id) {
    const seq = await getNextSequence('event');
    this.Event_id = `E${seq}`;
  }
  this.Updated_at = Date.now();
  next();
});

eventSchema.index({ Event_id: 1 });
eventSchema.index({ Date: 1 });
eventSchema.index({ Organizer_id: 1 });

module.exports = mongoose.model('Event', eventSchema);

