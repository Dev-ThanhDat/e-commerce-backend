const Coupon = require('../models/coupon.model');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

// ******************************* Create a coupon *******************************
module.exports.createCoupon = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { name } = req.body;
    const findCoupon = await Coupon.findOne({ name });
    if (findCoupon) {
      return res.status(409).json({
        success: false,
        message: 'Phiếu giảm giá đã tồn tại!'
      });
    }
    const newCoupon = await Coupon.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Tạo phiếu giảm giá thành công!',
      newCoupon
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all coupons *******************************
module.exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các phiếu giảm giá!',
      coupons
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a coupon *******************************
module.exports.updateCoupon = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const newCoupon = await Coupon.findByIdAndUpdate(
      req.params.couponId,
      req.body,
      { new: true }
    );
    if (!newCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu giảm giá!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật phiếu giảm giá thành công!',
      newCoupon
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a coupon *******************************
module.exports.deleteCoupon = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.couponId);
    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu giảm giá!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa phiếu giảm giá thành công!',
      deletedCoupon
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Apply coupon *******************************
module.exports.applyCoupon = async (req, res) => {
  try {
    const validCoupon = await Coupon.findOne({ name: req.body.coupon });
    if (validCoupon === null) {
      return res.status(400).json({
        success: false,
        message: 'Phiếu giảm giá không hợp lệ!'
      });
    }
    const user = await User.findOne({ _id: req.userId });
    const { cartTotal } = await Cart.findOne({
      orderBy: user._id
    }).populate('products.product');
    const totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderBy: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Áp dụng phiếu giảm giá thành công!',
      totalAfterDiscount
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
