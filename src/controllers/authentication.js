const Joi = require('joi');
const mongoose = require('mongoose');
const { validateUser } = require('../models/user');
const secret = require('../configs/secret');
const jwt = require('jsonwebtoken');

exports.register = (req,res,next) => {
    const {email,username,password,confirmpswd} = req.body;
    if(password === confirmpswd){
        const {error,value} = validateUser({
            email,
            username,
            password
        })

        if(error) return next(error);
        const User = mongoose.model('user');
        //check if email  and username already in used
        User.exists({$or:[{email:email},{username:username}]})
        .then(user=>{
            //check if User exist.
            if(user) return res.status(200).send('username or email already taken');
            
            //else create new user
            const newUser = new User(value);
            newUser.unhashpassword = password;
            return newUser.save();
        }).then(newuser=>{
            res.status(200).send('User registered, please confirm your email and update your profile');
        }).catch(error=>{
            return next(error);
        })
    }
}


/*
    Login.
    INPUT: {
        "email" : "",
        "password" : "",
    }
    output: {
        "accessToken" : "",
        "refreshToken": "",
    }
*/

exports.login = (req,res,next) => {
    const loginSchema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        // username: Joi.string().alphanum().min(2).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
    });
    
    const {error,value} = loginSchema.validate(req.body);
    if(error) return next(error);
    const {email,password} = value;
    const User = mongoose.model('user');
    User.findOne({email:email})
    .then(async (user)=>{
        if(user){
            let correct = await user.comparePassword(password);
            if(correct){
                const token = user.generateToken(secret['jwtSecret']);
                user.refreshToken = token.refreshToken;
                user.save();
                const cookieTokenOptions = {
                    httpOnly:true,
                    expires: new Date(Date.now() + 2*24*60*60*1000) // in 2 days
                }
                res.cookie('refreshToken',token.refreshToken,cookieTokenOptions);
                return res.status(200).send({token:token.accessToken});            
            }
        }
        res.status(400).send('Invalid Username or Password');
    }).catch(error=>{
        res.status(500);
        return next(error);
    })
}


/*
    logout/revokeToken:
    we remove refreshToken from database. so that refreshToken no longer valid to be use.
    Only loggedin user can logout??, 
    so we simply take user from our req object and remove the token.
*/
exports.logout = (req,res,next) => {
    const {user} = req;
    const User = mongoose.model('user');
    User.findById(user._id)
    .then(activeUser=>{
        activeUser.refreshToken = null;
        return activeUser.save();
    }).then(revoke=>{
        res.status(200).send("You're logged out...");
    }).catch(error=>{
        res.status(500);
        return next(error);
    })
}


/*
using cookieParser to use req.cookies
use when access token is expired, and need to quickly get new token without having to relogin.
INPUT: `just send the refreshtoken as httpOnly cookie`, and backend will verify it.
OUTPUT: new access token.
*/
exports.refreshToken = (req,res,next) =>{
    const token = req.cookies.refreshToken;
    console.log('secret:',secret['jwtSecret'])
    jwt.verify(token,secret['jwtSecret'], function(error,decoded){
        if(error) throw new Error('Invald refreshToken');
        const User = mongoose.model('user');
        User.findOne({
            _id: decoded._id,
            refreshToken: token,
        }).then(user=>{
            if(!user) throw new Error('Invalid Token');
            const newAccessToken = jwt.sign({
                _id: user._id.toString(),
                email: user.email,
                name: user.username
            },secret['jwtSecret'],{expiresIn:'1h'});
            return res.status(200).send({
                token: newAccessToken,
            })

        }).catch(error=>{
            console.error(error);
            res.status(400).send('Invalid refreshToken issued, please re-login!');
        })
    })
    // return res.send({refreshToken:token});
    
}


exports.verifyAccount = (req,res,next) =>{
    
}

/*
    method: POST
    INPUT: email address,
    OUTPUT: send email, contain links with token.
    - get email address, find user check if exist or not.
    - generate token and add to user.resetToken. (using jwt)
    - send email with url token.
    - url is the url of frontend.
    - frontend will extract the url, and use it in request body to verify the token.
*/
exports.getResetToken = (req,res,next) =>{

}
/*
    method: POST
    INPUT: {
        "resetToken" : "somerandomlongstrings"
    }   
    OUTPUT: verified.
    - get token from request.body send by frontend,
    - verify the token to be same as in database and not expired.
    - send comfirmation.
    - frontend will know that token is valid and redirect user to reset password page.
    - if token not valid, frontend will do something about it.
 */
exports.verifyResetToken = (req,res,next) =>{

}

/*
    method: POST
    INPUT: {
        "newPassword" : "something",
        "resetToken"  : "comfirmed/valid resetToken",
    }
    OUTPUT: password reset successfully.
    - receive newpassword and verified resetToken from frontend.
    - verify token again (just to be sure).
    - if valid, update the password, and set resetToken = null.

*/
exports.resetPassword = (req,res,next) =>{

}