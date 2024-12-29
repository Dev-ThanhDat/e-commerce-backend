const Brand = require('../models/brand.model');

// ******************************* Create a brand *******************************
module.exports.createBrand = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { title } = req.body;
    const findBrand = await Brand.findOne({ title });
    if (findBrand) {
      return res.status(409).json({
        success: false,
        message: 'Thương hiệu đã tồn tại!'
      });
    }
    const newBrand = await Brand.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Tạo thương hiệu thành công!',
      newBrand
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a brand *******************************
module.exports.updateBrand = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const newBrand = await Brand.findByIdAndUpdate(
      req.params.brandId,
      req.body,
      { new: true }
    );
    if (!newBrand) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thương hiệu!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật thương hiệu thành công!',
      newBrand
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a brand *******************************
module.exports.deleteBrand = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const deletedBrand = await Brand.findByIdAndDelete(req.params.brandId);
    if (!deletedBrand) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thương hiệu!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa thương hiệu thành công!',
      deletedBrand
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a brand *******************************
module.exports.getABrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thương hiệu!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy thương hiệu!',
      brand
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all brands *******************************
module.exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các thương hiệu!',
      brands
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
