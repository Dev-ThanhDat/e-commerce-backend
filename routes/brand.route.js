const router = require('express').Router();

const brandController = require('../controllers/brand.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/', brandController.getAllBrands);
router.get('/:brandId', brandController.getABrand);
router.post('/', verifyToken, verifyIsAdmin, brandController.createBrand);
router.put(
  '/:brandId',
  verifyToken,
  verifyIsAdmin,
  brandController.updateBrand
);
router.delete(
  '/:brandId',
  verifyToken,
  verifyIsAdmin,
  brandController.deleteBrand
);

module.exports = router;
