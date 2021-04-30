const passport = require('passport');
const AuthController = require('../controllers/authentication');
const { RequireLogin } = require('../middlewares/Authentication');
const router = require('express').Router();

router.post('/login',AuthController.login);
router.get('/logout',RequireLogin,AuthController.logout);
router.post('/register',AuthController.register);
router.post('/refresh-token',AuthController.refreshToken);

//email verification
router.get('/verify',AuthController.verifyAccount);
//test sendmail
router.get('/testmail',(req,res,next)=>{
    const Mailer = require('../services/mailer');
    const mail = new Mailer('gmail');
    mail.sendMail({
        from:'sender@gmail.com',
        to:'nurfitri.abdrahman@gmail.com', //receiver email
        subject:'test gmail',
        html: "<h1>Hello World</h1>"
    },function(error,info){
        if(error) return next(error);
        res.send('Email sent to your email');
    });
})

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