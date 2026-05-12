const { Payment, Booking } = require('../models');

// @route   POST /api/payments
// @desc    Create a payment
// @access  Private
const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, cardLastFour } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bookingId, amount, and paymentMethod',
      });
    }

    // Check if booking exists
    const booking = await Booking.findOne({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking already paid',
      });
    }

    // Create payment
    const payment = await Payment.create({
      bookingId,
      userId,
      amount,
      paymentMethod,
      cardLastFour,
      transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'completed', // In real scenario, integrate with payment gateway
      paymentDate: new Date(),
    });

    // Update booking payment status
    await booking.update({
      paymentStatus: 'completed',
      status: 'confirmed',
    });

    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing payment',
    });
  }
};

// @route   GET /api/payments
// @desc    Get current user payments
// @access  Private
const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Booking,
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      payments: rows,
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching payments',
    });
  }
};

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      where: { id, userId },
      include: [{ model: Booking }],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Get payment by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching payment',
    });
  }
};

// @route   PUT /api/payments/:id/refund
// @desc    Refund a payment
// @access  Private
const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      where: { id, userId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment already refunded',
      });
    }

    // Update payment status
    await payment.update({ status: 'refunded' });

    // Update booking status
    const booking = await Booking.findByPk(payment.bookingId);
    await booking.update({
      status: 'cancelled',
      paymentStatus: 'refunded',
    });

    return res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error refunding payment',
    });
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getPaymentById,
  refundPayment,
};
