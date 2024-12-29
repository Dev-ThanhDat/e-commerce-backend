const Blog = require('../models/blog.model');

// ******************************* Create a blog *******************************
module.exports.createBlog = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường là bắt buộc!'
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Hình ảnh là bắt buộc!'
      });
    }
    const maxSize = 20 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước hình ảnh phải nhỏ hơn 20MB!'
      });
    }
    const newBlog = await Blog.create({ ...req.body, image: req.file.path });
    return res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công!',
      newBlog
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a blog *******************************
module.exports.updateBlog = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Hình ảnh là bắt buộc!'
      });
    }
    const maxSize = 20 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước hình ảnh phải nhỏ hơn 20MB!'
      });
    }
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      { ...req.body, image: req.file.path },
      { new: true }
    );
    if (!updateBlog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viêt!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật bài viết thành công!',
      updateBlog
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a blog *******************************
module.exports.getABlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      { $inc: { numViews: 1 } },
      { new: true }
    )
      .populate('likes', '-password -refreshToken')
      .populate('dislikes', '-password -refreshToken');
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy bài viết!',
      blog
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all blog *******************************
module.exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các bài viết!',
      blogs
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a blog *******************************
module.exports.deleteABlog = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const deletedBlog = await Blog.findByIdAndDelete(req.params.blogId);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy blog!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa bài viết thành công!',
      deletedBlog
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Like a blog *******************************
module.exports.likeBlog = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const blog = await Blog.findById(req.params.blogId);
    const alreadyDisliked = blog.dislikes.find(
      (userId) => userId.toString() === req.userId.toString()
    );
    if (alreadyDisliked) {
      await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $pull: { dislikes: req.userId },
          isDisliked: false
        },
        { new: true }
      );
    }
    const likedBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $push: { likes: req.userId },
        isLiked: true
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Đã thích bài viết!',
      likedBlog
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Dislike a blog *******************************
module.exports.dislikeBlog = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const blog = await Blog.findById(req.params.blogId);
    const alreadyLiked = blog.likes.find(
      (userId) => userId.toString() === req.userId.toString()
    );
    if (alreadyLiked) {
      await Blog.findByIdAndUpdate(
        req.params.blogId,
        {
          $pull: { likes: req.userId },
          isLiked: false
        },
        { new: true }
      );
    }
    const dislikedBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $push: { dislikes: req.userId },
        isDisliked: true
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Đã bỏ thích bài viết!',
      dislikedBlog
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
