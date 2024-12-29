const Product = require('../models/product.model');
const User = require('../models/user.model');
const slugify = require('slugify');

// ******************************* Create a product *******************************
module.exports.createProduct = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    if (req.body.title) {
      const findProductBySlug = await Product.findOne({
        slug: req.body.slug
      }).select('slug');
      if (findProductBySlug) {
        return res.status(409).json({
          success: false,
          message: 'Slug của sản phẩm đã tồn tại. Vui lòng thay đổi tiêu đề!'
        });
      }
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        trim: true
      });
    }
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'Hình ảnh là bắt buộc!'
      });
    }
    const maxSize = 20 * 1024 * 1024;
    if (req.files.some((file) => file.size > maxSize)) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước hình ảnh phải nhỏ hơn 20 MB!'
      });
    }
    const newProduct = await Product.create({
      ...req.body,
      images: req.files.map((file) => file.path)
    });
    return res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công!',
      newProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a single product *******************************
module.exports.getAProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy sản phẩm!',
      product
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all products *******************************
module.exports.getAllProducts = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productsCount = await Product.countDocuments();
      if (skip > productsCount) {
        return res.status(404).json({
          success: false,
          message: 'Trang này không tồn tại!'
        });
      }
    }
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm!'
      });
    }
    const products = await query;
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các sản phẩm!',
      products
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a product *******************************
module.exports.updateAProduct = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const findProduct = await Product.findById(req.params.productId);
    if (req.body.title && req.body.title !== findProduct.title) {
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        trim: true
      });
      const findProductBySlug = await Product.findOne({ slug: req.body.slug });
      if (findProductBySlug) {
        return res.status(409).json({
          success: false,
          message: 'Slug của sản phẩm đã tồn tại. Vui lòng thay đổi tiêu đề!'
        });
      }
    }
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'Hình ảnh là bắt buộc!'
      });
    }
    const maxSize = 20 * 1024 * 1024;
    if (req.files.some((file) => file.size > maxSize)) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước hình ảnh phải nhỏ hơn 20 MB!'
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.body,
        images: req.files.map((file) => file.path)
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      updatedProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a product *******************************
module.exports.deleteAProduct = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { wishlist: req.params.productId, cart: req.params.productId }
      },
      { new: true }
    );
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công!',
      deletedProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Rating a product *******************************
module.exports.rating = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const { star, productId, comment } = req.body;
    const product = await Product.findById(productId);
    const alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === req.userId.toString()
    );
    if (alreadyRated) {
      await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: req.userId
            }
          }
        },
        { new: true }
      );
    }
    const getallRatings = await Product.findById(productId);
    const totalRating = getallRatings.ratings.length;
    const ratingSum = getallRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(ratingSum / totalRating);
    const updatedRating = await Product.findByIdAndUpdate(
      productId,
      { totalRating: actualRating },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Đã đánh giá sản phẩm!',
      updatedRating
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
