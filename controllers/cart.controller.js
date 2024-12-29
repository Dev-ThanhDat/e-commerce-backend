const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// ******************************* Add to cart *******************************
module.exports.addCart = async (req, res) => {
  const { cart } = req.body;
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    let products = [];
    const user = await User.findById(req.userId);
    const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
    if (alreadyExistCart) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng đã tồn tại!'
      });
    }
    for (let i = 0; i < cart.length; i++) {
      let obj = {};
      obj.product = cart[i]._id;
      obj.quantity = cart[i].quantity;
      obj.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price');
      obj.price = getPrice.price;
      products.push(obj);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].quantity;
    }
    const newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user?._id
    }).save();
    return res.status(200).json({
      success: true,
      message: 'Đã thêm vào giỏ hàng!',
      newCart
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get cart *******************************
module.exports.getCart = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const cart = await Cart.findOne({ orderBy: req.params.userId }).populate(
      'products.product'
    );
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy giỏ hàng!',
      cart
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Empty cart *******************************
module.exports.emptyCart = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const user = await User.findOne({ _id: req.params.userId });
    const cart = await Cart.findOneAndDelete({ orderBy: user?._id });
    return res.status(200).json({
      success: true,
      message: 'Giỏ hàng đã trống!',
      cart
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
