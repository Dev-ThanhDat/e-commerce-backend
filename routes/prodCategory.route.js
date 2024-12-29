const router = require('express').Router();

const prodCategoryController = require('../controllers/prodCategory.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/', prodCategoryController.getAllCategories);
router.get('/:categoryId', prodCategoryController.getACategory);
router.post(
  '/',
  verifyToken,
  verifyIsAdmin,
  prodCategoryController.createCategory
);
router.put(
  '/:categoryId',
  verifyToken,
  verifyIsAdmin,
  prodCategoryController.updateCategory
);
router.delete(
  '/:categoryId',
  verifyToken,
  verifyIsAdmin,
  prodCategoryController.deleteCategory
);

module.exports = router;
