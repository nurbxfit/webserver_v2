const passport = require('passport');
const AuthController = require('../controllers/authentication');
const { RequireLogin } = require('../middlewares/Authentication');
const router = require('express').Router();

router.post('/login',AuthController.login);
router.get('/logout',RequireLogin,AuthController.logout);
router.post('/register',AuthController.register);
router.post('/refresh-token',AuthController.refreshToken);

//Google Oauth
// router.get('/failed',(req,res,next)=>{
//     res.send('Failed to login')
// })
// router.get('/success',(req,res,next)=>{
//     console.log('user:',req.user);
//     res.send('Google Login Success');
// })
// router.get('/google',passport.authenticate('google',{
//     scope:['profile','email']
// }));

// router.get('/google/redirect',passport.authenticate('google',{failureRedirect:'/auth/failed'}),(req,res,next)=>{
//     res.redirect('/auth/success')
// })

module.exports = router;