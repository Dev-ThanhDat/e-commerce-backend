const router = require('express').Router();

const colorController = require('../controllers/color.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get('/', colorController.getAllColors);
router.get('/:colorId', colorController.getAColor);
router.post('/', verifyToken, verifyIsAdmin, colorController.createColor);
router.put(
  '/:colorId',
  verifyToken,
  verifyIsAdmin,
  colorController.updateColor
);
router.delete(
  '/:colorId',
  verifyToken,
  verifyIsAdmin,
  colorController.deleteColor
);

module.exports = router;
