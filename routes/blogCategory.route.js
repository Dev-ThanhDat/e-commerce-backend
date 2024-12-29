const router = require('express').Router();

const blogCategoryController = require('../controllers/blogCategory.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/', blogCategoryController.getAllCategories);
router.get('/:categoryId', blogCategoryController.getACategory);
router.post(
  '/',
  verifyToken,
  verifyIsAdmin,
  blogCategoryController.createCategory
);
router.put(
  '/:categoryId',
  verifyToken,
  verifyIsAdmin,
  blogCategoryController.updateCategory
);
router.delete(
  '/:categoryId',
  verifyToken,
  verifyIsAdmin,
  blogCategoryController.deleteCategory
);

module.exports = router;
