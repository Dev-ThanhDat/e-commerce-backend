const router = require('express').Router();

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.put('/reset-password', verifyToken, authController.resetPassword);

module.exports = router;
