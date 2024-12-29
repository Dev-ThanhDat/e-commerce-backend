const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    numViews: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dzdycjg8q/image/upload/v1732624466/E-Commerce/huong-dan-tao-blog-website_ggwgny.png'
    },
    author: {
      type: String,
      default: 'ADMIN'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
