const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  travellers: {
    type: Number,
    required: true
  },
  tripDays: {
    type: Number,
    required: true
  },
  minRating: {
    type: Number,
    required: true
  },
  maxRating: {
    type: Number,
    required: true
  },
  flightDetails: {
    type: String,
    required: true
  },
  hotelDetails: {
    type: String,
    required: true
  },
  iteneryDetails: {
    type: String,
    required: true
  }
});

const History = mongoose.model('History', historySchema);

module.exports = History;
