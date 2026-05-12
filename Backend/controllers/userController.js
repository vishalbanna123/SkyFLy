const { User } = require('../models');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        country: user.country,
        passportNumber: user.passportNumber,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, address, city, country, passportNumber } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      address: address || user.address,
      city: city || user.city,
      country: country || user.country,
      passportNumber: passportNumber || user.passportNumber,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        country: user.country,
        passportNumber: user.passportNumber,
      },
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating user profile',
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
