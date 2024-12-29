const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const userIsAdmin = await User.findById(req.userId).select('role');
    if (userIsAdmin.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không phải là quản trị viên!'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
