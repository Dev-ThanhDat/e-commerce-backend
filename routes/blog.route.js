const router = require('express').Router();
const { uploadCloud } = require('../config/cloudinary.config');

const blogController = require('../controllers/blog.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/', blogController.getAllBlog);
router.get('/:blogId', blogController.getABlog);
router.post('/like/:blogId', verifyToken, blogController.likeBlog);
router.post('/dislike/:blogId', verifyToken, blogController.dislikeBlog);
router.post(
  '/',
  verifyToken,
  verifyIsAdmin,
  uploadCloud.single('image'),
  blogController.createBlog
);
router.put(
  '/:blogId',
  verifyToken,
  verifyIsAdmin,
  uploadCloud.single('image'),
  blogController.updateBlog
);
router.delete(
  '/:blogId',
  verifyToken,
  verifyIsAdmin,
  blogController.deleteABlog
);

module.exports = router;
