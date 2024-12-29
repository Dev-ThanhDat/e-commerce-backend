const router = require('express').Router();
const { uploadCloud } = require('../config/cloudinary.config');

const productController = require('../controllers/product.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getAProduct);
router.put('/rating', verifyToken, productController.rating);
router.post(
  '/',
  verifyToken,
  verifyIsAdmin,
  uploadCloud.array('images'),
  productController.createProduct
);
router.put(
  '/:productId',
  verifyToken,
  verifyIsAdmin,
  uploadCloud.array('images'),
  productController.updateAProduct
);

router.delete(
  '/:productId',
  verifyToken,
  verifyIsAdmin,
  productController.deleteAProduct
);

module.exports = router;
