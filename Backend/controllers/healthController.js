const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'Server is running',
    message: 'Flight Booking API is healthy',
  });
};

module.exports = {
  getHealth,
};
