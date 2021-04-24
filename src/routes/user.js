const { RequireLogin } = require('../middlewares/Authentication');
const UserController = require('../controllers/user');
const router = require('express').Router();

router.get('/',UserController.get);
router.get('/:userId/profile',UserController.getById);
router.post('/search',RequireLogin,UserController.search);
router.post('/update',RequireLogin,UserController.update);
router.post('/profile/update',RequireLogin,UserController.updateProfile);
// router.post('/changePassword',RequireLogin,UserController.changePassword);

module.exports = router;