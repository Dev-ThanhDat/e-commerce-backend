const BlogCategory = require('../models/blogCategory.model');

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
    const findCategory = await BlogCategory.findOne({ title });
    if (findCategory) {
      return res.status(409).json({
        success: false,
        message: 'Danh mục bài viết đã tồn tại!'
      });
    }
    const newCategory = await BlogCategory.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Tạo danh mục bài viết thành công!',
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
    const newCategory = await BlogCategory.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );
    if (!newCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục bài viết!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục bài viết thành công!',
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
    const deletedCategory = await BlogCategory.findByIdAndDelete(
      req.params.categoryId
    );
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục bài viết!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa danh mục bài viết thành công!',
      deletedCategory
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a category *******************************
module.exports.getACategory = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục bài viết!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy danh mục bài viết!',
      category
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all categories *******************************
module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các danh mục bài viết!',
      categories
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
