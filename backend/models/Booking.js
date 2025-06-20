const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  fromPincode: String,
  toPincode: String,
  startTime: Date,
  endTime: Date,
  customerId: String
});

module.exports = mongoose.model('Booking', bookingSchema);
