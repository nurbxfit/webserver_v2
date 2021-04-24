const mongoose = require('mongoose');
const { validateUser } = require('../models/user');

exports.register = (req,res,next) => {
    const {email,username,password,confirmpswd} = req.body;
    if(password === confirmpswd){
        const {error,validUser} = validateUser({
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
            const newUser = new User(validUser);
            newUser.unhashpassword = password;
            return newUser.save();
        }).then(newuser=>{
            res.status(200).send('User registered, please confirm your email and update your profile');
        }).catch(error=>{
            next(error);
        })
    }
}


exports.login = (req,res,next) => {

}


exports.logout = (req,res,next) => {

}

exports.refreshToken = (req,res,next) =>{

}


exports.verifyAccount = (req,res,next) =>{
    
}