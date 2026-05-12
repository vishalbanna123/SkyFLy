const { Booking, Flight, User } = require('../models');
const { Op } = require('sequelize');

// Generate booking reference
const generateBookingReference = () => {
  return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { flightId, passengerName, seatClass } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!flightId || !passengerName || !seatClass) {
      return res.status(400).json({
        success: false,
        message: 'Please provide flightId, passengerName, and seatClass',
      });
    }

    // Check if flight exists
    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    if (flight.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No seats available on this flight',
      });
    }

    // Get price based on seat class
    let price = flight.economyPrice;
    if (seatClass === 'business') price = flight.businessPrice || flight.economyPrice;
    if (seatClass === 'first-class') price = flight.firstClassPrice || flight.economyPrice;

    // Create booking
    const booking = await Booking.create({
      userId,
      flightId,
      bookingReference: generateBookingReference(),
      passengerName,
      seatClass,
      totalPrice: price,
      status: 'pending',
    });

    // Update available seats
    await flight.update({
      availableSeats: flight.availableSeats - 1,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating booking',
    });
  }
};

// @route   GET /api/bookings
// @desc    Get current user bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: { userId },
      include: [{ model: Flight }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      bookings: rows,
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookings',
    });
  }
};

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, userId },
      include: [
        { model: Flight },
        { model: User },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking',
    });
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, userId },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    await booking.update({ status: 'cancelled' });

    // Return seat to flight
    const flight = await Flight.findByPk(booking.flightId);
    await flight.update({
      availableSeats: flight.availableSeats + 1,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling booking',
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
