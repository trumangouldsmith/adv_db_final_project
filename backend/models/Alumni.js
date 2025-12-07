const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

const alumniSchema = new mongoose.Schema({
  Alumni_id: {
    type: String,
    unique: true
  },
  Name: {
    type: String,
    required: true
  },
  Graduation_year: {
    type: Number,
    required: true
  },
  Field_of_study: [String],
  Address: String,
  Phone: String,
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  Password: {
    type: String,
    required: true
  },
  Employment_status: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Unemployed', 'Student', 'Self-Employed']
  },
  Employer: String,
  Employer_location: {
    City: String,
    State: String
  },
  Employment_title: String,
  Employment_history: [{
    Employer: String,
    Employment_title: String,
    Start_date: Date,
    End_date: Date,
    Location: {
      City: String,
      State: String
    }
  }],
  Events_history: [String],
  Created_at: {
    type: Date,
    default: Date.now
  },
  Updated_at: {
    type: Date,
    default: Date.now
  }
});

alumniSchema.pre('save', async function(next) {
  if (!this.Alumni_id) {
    const seq = await getNextSequence('alumni');
    this.Alumni_id = `A${seq}`;
  }
  this.Updated_at = Date.now();
  next();
});

alumniSchema.index({ Email: 1 });
alumniSchema.index({ Alumni_id: 1 });
alumniSchema.index({ Employer: 1 });
alumniSchema.index({ Graduation_year: 1 });

module.exports = mongoose.model('Alumni', alumniSchema);

