const { Flight } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/flights/search
// @desc    Search flights
// @access  Public
const searchFlights = async (req, res) => {
  try {
    const { departure, arrival, departureDate } = req.query;

    if (!departure || !arrival || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide departure, arrival, and departureDate',
      });
    }

    // Parse date to get start and end of day
    const searchDate = new Date(departureDate);
    const startOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(), 23, 59, 59, 999);

    const flights = await Flight.findAll({
      where: {
        departureCity: {
          [Op.iLike]: `%${departure}%`,
        },
        arrivalCity: {
          [Op.iLike]: `%${arrival}%`,
        },
        departureTime: {
          [Op.between]: [startOfDay, endOfDay],
        },
        availableSeats: {
          [Op.gt]: 0,
        },
      },
      order: [['departureTime', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      count: flights.length,
      flights,
    });
  } catch (error) {
    console.error('Search flights error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error searching flights',
    });
  }
};

// @route   GET /api/flights
// @desc    Get all flights
// @access  Public
const getAllFlights = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Flight.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['departureTime', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      flights: rows,
    });
  } catch (error) {
    console.error('Get all flights error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching flights',
    });
  }
};

// @route   GET /api/flights/:id
// @desc    Get flight by ID
// @access  Public
const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await Flight.findByPk(id);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    return res.status(200).json({
      success: true,
      flight,
    });
  } catch (error) {
    console.error('Get flight by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching flight',
    });
  }
};

// @route   POST /api/flights
// @desc    Create a new flight (Admin only)
// @access  Private
const createFlight = async (req, res) => {
  try {
    const {
      flightNumber,
      airline,
      departureCity,
      arrivalCity,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      duration,
      totalSeats,
      availableSeats,
      economyPrice,
      businessPrice,
      firstClassPrice,
      stops,
      aircraft,
    } = req.body;

    // Validate required fields
    if (
      !flightNumber ||
      !airline ||
      !departureCity ||
      !arrivalCity ||
      !departureAirport ||
      !arrivalAirport ||
      !departureTime ||
      !arrivalTime ||
      !economyPrice
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const flight = await Flight.create({
      flightNumber,
      airline,
      departureCity,
      arrivalCity,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      duration,
      totalSeats: totalSeats || 180,
      availableSeats: availableSeats || totalSeats || 180,
      economyPrice,
      businessPrice,
      firstClassPrice,
      stops: stops || 0,
      aircraft,
    });

    return res.status(201).json({
      success: true,
      message: 'Flight created successfully',
      flight,
    });
  } catch (error) {
    console.error('Create flight error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating flight',
    });
  }
};

module.exports = {
  searchFlights,
  getAllFlights,
  getFlightById,
  createFlight,
};
