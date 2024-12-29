const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number
        },
        color: {
          type: String
        },
        price: {
          type: Number
        }
      }
    ],
    cartTotal: {
      type: Number
    },
    totalAfterDiscount: {
      type: Number
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
