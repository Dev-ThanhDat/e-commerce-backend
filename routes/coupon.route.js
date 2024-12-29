const router = require('express').Router();

const couponController = require('../controllers/coupon.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.post('/', verifyToken, verifyIsAdmin, couponController.createCoupon);
router.get('/', verifyToken, verifyIsAdmin, couponController.getAllCoupons);
router.put(
  '/:couponId',
  verifyToken,
  verifyIsAdmin,
  couponController.updateCoupon
);
router.delete(
  '/:couponId',
  verifyToken,
  verifyIsAdmin,
  couponController.deleteCoupon
);
router.post('/apply', verifyToken, verifyIsAdmin, couponController.applyCoupon);

module.exports = router;
