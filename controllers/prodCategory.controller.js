const ProdCategory = require('../models/prodCategory.model');

// ******************************* Create a category *******************************
module.exports.createCategory = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { title } = req.body;
    const findCategory = await ProdCategory.findOne({ title });
    if (findCategory) {
      return res.status(409).json({
        success: false,
        message: 'Danh mục sản phẩm đã tồn tại!'
      });
    }
    const newCategory = await ProdCategory.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Tạo danh mục sản phẩm thành công!',
      newCategory
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a category *******************************
module.exports.updateCategory = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const newCategory = await ProdCategory.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );
    if (!newCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục sản phẩm!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục sản phẩm thành công!',
      newCategory
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a category *******************************
module.exports.deleteCategory = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const deletedCategory = await ProdCategory.findByIdAndDelete(
      req.params.categoryId
    );
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục sản phẩm!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa danh mục sản phẩm thành công!',
      deletedCategory
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a category *******************************
module.exports.getACategory = async (req, res) => {
  try {
    const category = await ProdCategory.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục sản phẩm!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy danh mục sản phẩm!',
      category
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all categories *******************************
module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProdCategory.find();
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các danh mục sản phẩm!',
      categories
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
