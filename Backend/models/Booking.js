const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  flightId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Flights',
      key: 'id',
    },
  },
  bookingReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passengerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seatClass: {
    type: DataTypes.ENUM('economy', 'business', 'first-class'),
    defaultValue: 'economy',
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  bookingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = Booking;
