const router = require('express').Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/:userId', verifyToken, userController.getAUser);
router.put('/:userId', verifyToken, userController.updateAUser);
router.delete('/:userId', verifyToken, userController.deleteAUser);
router.get('/wishlist/:userId', verifyToken, userController.getWishlist);
router.post('/wishlist/:productId', verifyToken, userController.addToWishlist);
router.put('/save-address/:userId', verifyToken, userController.saveAdress);
router.get(
  '/all-users',
  verifyToken,
  verifyIsAdmin,
  userController.getAllUsers
);
router.post(
  '/block/:userId',
  verifyToken,
  verifyIsAdmin,
  userController.blockAUser
);
router.post(
  '/unblock/:userId',
  verifyToken,
  verifyIsAdmin,
  userController.unblockAUser
);

module.exports = router;
