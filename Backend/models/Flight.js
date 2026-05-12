const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  flightNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arrivalCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureAirport: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arrivalAirport: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrivalTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING, // e.g., "2h 30m"
    allowNull: true,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 180,
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 180,
  },
  economyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  businessPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  firstClassPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stops: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  aircraft: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = Flight;
