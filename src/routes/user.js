const { RequireLogin } = require("../middlewares/Authentication");
const UserController = require("../controllers/user");
const router = require("express").Router();

router.get("/", UserController.get);
router.get("/:userId/profile", UserController.getById);
router.post("/search", UserController.search);
router.put("/update", RequireLogin, UserController.update);
router.put("/profile/update", RequireLogin, UserController.updateProfile);
// router.post('/changePassword',RequireLogin,UserController.changePassword);

module.exports = router;
