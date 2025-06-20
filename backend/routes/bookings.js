const routerB = require('express').Router();
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

routerB.post('/', async (req, res) => {
  const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).send('Vehicle not found');
  const duration = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
  const endTime = new Date(new Date(startTime).getTime() + duration * 3600000);
  const conflict = await Booking.findOne({
    vehicleId,
    startTime: { $lt: endTime },
    endTime: { $gt: new Date(startTime) },
  });
  if (conflict) return res.status(409).send('Vehicle already booked in this time slot');
  const booking = new Booking({ vehicleId, fromPincode, toPincode, startTime, endTime, customerId });
  await booking.save();
  res.status(201).json(booking);
});

module.exports = routerB;
