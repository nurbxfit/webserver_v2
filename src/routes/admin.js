const router = require('express').Router();
const {RequireLogin,Layer0} = require('../middlewares/Authentication');
const RoleController = require('../controllers/role');


//Routes for role.
router.get('/role-list',RequireLogin,Layer0,RoleController.get);
router.post('/create-role',RequireLogin,Layer0,RoleController.create);
router.post('/update-role',RequireLogin,Layer0,RoleController.update);
router.post('/delete-role',RequireLogin,Layer0,RoleController.delete);

//assign and Detach role to a user.
// router.get('/user-list',RequireLogin,Layer0,RoleController.getUsers);
router.post('/assign-role',RequireLogin,Layer0,RoleController.assign);
router.post('/detach-role',RequireLogin,Layer0,RoleController.detach);


module.exports = router;