const router = require('express').Router();

const cartController = require('../controllers/cart.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.post('/', verifyToken, cartController.addCart);
router.get('/:userId', verifyToken, cartController.getCart);
router.delete('/:userId', verifyToken, cartController.emptyCart);

module.exports = router;
