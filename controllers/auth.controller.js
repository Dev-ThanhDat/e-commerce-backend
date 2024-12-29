const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ******************************* Register *******************************
module.exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường là bắt buộc!'
      });
    }
    const findUserByEmail = await User.findOne({ email });
    if (findUserByEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email đã tồn tại!'
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword
    });
    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Login *******************************
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường là bắt buộc!'
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không hợp lệ!'
      });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.EXPIRESIN_TOKEN}d`
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.EXPIRESIN_REFRESH}d`
    });
    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
    const {
      password: hashedPassword,
      refreshToken: signedRefreshToken,
      ...rest
    } = user._doc;
    return res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.EXPIRESIN_REFRESH) * 24 * 60 * 60 * 1000
      })
      .json({
        success: true,
        message: 'Đăng nhập tài khoản thành công!',
        accessToken,
        user: rest
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Logout *******************************
module.exports.logout = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Không có refresh token ở trong cookies!'
      });
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy người dùng nào có refresh token này!'
      });
    }
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: null },
      { new: true }
    );
    return res.status(200).clearCookie('refreshToken').json({
      success: true,
      message: 'Đăng xuất tài khoản thành công!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Refresh Token *******************************
module.exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Không có refresh token ở trong cookies!'
      });
    }
    const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: id, refreshToken });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy người dùng nào có refresh token này!'
      });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.EXPIRESIN_TOKEN}d`
    });
    return res.status(200).json({
      success: true,
      message: 'Làm mới token thành công!',
      accessToken
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Reset Password *******************************
module.exports.resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường là bắt buộc!'
      });
    }
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu cũ không hợp lệ!'
      });
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Cập nhật mật khẩu thành công!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
