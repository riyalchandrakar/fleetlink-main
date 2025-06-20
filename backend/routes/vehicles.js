const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// Calculate duration in hours using pincode difference
function calculateRideDuration(from, to) {
  return Math.abs(parseInt(to) - parseInt(from)) % 24;
}

// Add Vehicle
router.post('/', async (req, res) => {
  const { name, capacityKg, tyres } = req.body;
  if (!name || !capacityKg || !tyres) {
    return res.status(400).send('Missing fields');
  }

  try {
    const vehicle = new Vehicle({ name, capacityKg, tyres });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).send('Server error while adding vehicle');
  }
});

// Get available vehicles with next available time (if booked)
router.get('/available', async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    // Input validation
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).send("Missing required query parameters");
    }

    // Safe startTime parsing
    const cleanStartTime = startTime.trim().replace(' ', 'T');
    const parsedStartTime = new Date(cleanStartTime);

    console.log("Received startTime:", startTime);
    console.log("Parsed Date:", parsedStartTime);

    if (isNaN(parsedStartTime)) {
      return res.status(400).send("Invalid startTime");
    }

    // Calculate ride duration and endTime
    const duration = calculateRideDuration(fromPincode, toPincode);
    const endTime = new Date(parsedStartTime.getTime() + duration * 3600000);

    // Find matching vehicles
    const vehicles = await Vehicle.find({
      capacityKg: { $gte: parseInt(capacityRequired) }
    });

    if (!vehicles.length) {
      return res.status(200).json({ vehicles: [], estimatedRideDurationHours: duration });
    }

    // Map vehicles with availability info
    const responseVehicles = await Promise.all(
      vehicles.map(async (v) => {
        const conflict = await Booking.findOne({
          vehicleId: v._id,
          startTime: { $lt: endTime },
          endTime: { $gt: parsedStartTime }
        });

        if (!conflict) {
          return {
            _id: v._id,
            name: v.name,
            capacityKg: v.capacityKg,
            tyres: v.tyres,
            available: true
          };
        } else {
          const latestBooking = await Booking.find({ vehicleId: v._id })
            .sort({ endTime: -1 })
            .limit(1);
          const nextAvailableTime = latestBooking[0]?.endTime;

          return {
            _id: v._id,
            name: v.name,
            capacityKg: v.capacityKg,
            tyres: v.tyres,
            available: false,
            nextAvailableTime
          };
        }
      })
    );

    res.status(200).json({
      vehicles: responseVehicles,
      estimatedRideDurationHours: duration
    });
  } catch (err) {
    console.error("Error in GET /available:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
