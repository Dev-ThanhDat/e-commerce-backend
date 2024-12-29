const Color = require('../models/color.model');

// ******************************* Create a color *******************************
module.exports.createColor = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { title } = req.body;
    const findColor = await Color.findOne({ title });
    if (findColor) {
      return res.status(409).json({
        success: false,
        message: 'Màu đã tồn tại!'
      });
    }
    const newColor = await Color.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Tạo màu thành công!',
      newColor
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a color *******************************
module.exports.updateColor = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const newColor = await Color.findByIdAndUpdate(
      req.params.colorId,
      req.body,
      { new: true }
    );
    if (!newColor) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy màu!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật màu thành công!',
      newColor
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a color *******************************
module.exports.deleteColor = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const deletedColor = await Color.findByIdAndDelete(req.params.colorId);
    if (!deletedColor) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy màu!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa màu thành công!',
      deletedColor
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a color *******************************
module.exports.getAColor = async (req, res) => {
  try {
    const color = await Color.findById(req.params.colorId);
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy màu!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy màu!',
      color
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all colors *******************************
module.exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các màu!',
      colors
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
