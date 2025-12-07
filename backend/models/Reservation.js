const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

const reservationSchema = new mongoose.Schema({
  Reservation_id: {
    type: String,
    unique: true
  },
  Alumni_id: {
    type: String,
    required: true
  },
  Event_id: {
    type: String,
    required: true
  },
  Number_of_attendees: {
    type: Number,
    default: 1
  },
  Payment_amount: Number,
  Payment_status: {
    type: String,
    enum: ['Paid', 'Pending', 'Refunded', 'Cancelled'],
    default: 'Pending'
  },
  Payment_information: {
    Payment_method: String,
    Card_type: String,
    Last_four_digits: String,
    Transaction_id: String,
    Payment_date: Date
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

reservationSchema.pre('save', async function(next) {
  if (!this.Reservation_id) {
    const seq = await getNextSequence('reservation');
    this.Reservation_id = `R${seq}`;
  }
  this.Updated_at = Date.now();
  next();
});

reservationSchema.index({ Reservation_id: 1 });
reservationSchema.index({ Alumni_id: 1 });
reservationSchema.index({ Event_id: 1 });
reservationSchema.index({ Alumni_id: 1, Event_id: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema);

