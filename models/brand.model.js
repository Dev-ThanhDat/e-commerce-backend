const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', bandSchema);
