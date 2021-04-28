const AuthController = require('../controllers/authentication');
const router = require('express').Router();

router.post('/login',AuthController.login);
router.post('/logout',AuthController.logout);
router.post('/register',AuthController.register);
router.post('/refresh-token',AuthController.refreshToken);

module.exports = router;