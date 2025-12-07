const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

const photoSchema = new mongoose.Schema({
  Photo_id: {
    type: String,
    unique: true
  },
  File_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  File_name: {
    type: String,
    required: true
  },
  File_size: Number,
  Mime_type: String,
  Alumni_id: {
    type: String,
    required: true
  },
  Event_id: {
    type: String,
    default: null
  },
  Tags: [String],
  Upload_date: {
    type: Date,
    default: Date.now
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

photoSchema.pre('save', async function(next) {
  if (!this.Photo_id) {
    const seq = await getNextSequence('photo');
    this.Photo_id = `P${seq}`;
  }
  this.Updated_at = Date.now();
  next();
});

photoSchema.index({ Photo_id: 1 });
photoSchema.index({ Alumni_id: 1 });
photoSchema.index({ Event_id: 1 });
photoSchema.index({ Tags: 1 });

module.exports = mongoose.model('Photo', photoSchema);

