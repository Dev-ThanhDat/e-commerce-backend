const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

// ******************************* Create order *******************************
module.exports.createOrder = async (req, res) => {
  try {
    const { couponApplied } = req.body;
    const user = await User.findOne({ _id: req.userId });
    const cart = await Cart.findOne({ orderBy: user._id });
    const finalAmount =
      couponApplied && cart.totalAfterDiscount
        ? cart.totalAfterDiscount
        : cart.cartTotal;
    const order = await new Order({
      products: cart.products,
      amount: finalAmount,
      orderBy: user._id
    }).save();
    const update = cart.products.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }));
    await Product.bulkWrite(update);
    res.status(200).json({
      success: true,
      message: 'Đơn hàng được đặt thành công!',
      order
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get order *******************************
module.exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderBy: req.params.userId }).populate(
      'products.product'
    );
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy đơn hàng!',
      order
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update order status *******************************
module.exports.updateOrderStatus = async (req, res) => {
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: req.body.status },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      updateOrderStatus
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
