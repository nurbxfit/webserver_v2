const Joi = require('joi');
const mongoose = require('mongoose');
const { validateUser } = require('../models/user');
const secret = require('../configs/secret');

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
        username: Joi.string().alphanum().min(2).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
    }).or('email','password');
    
    const {error,value} = loginSchema.validate(req.body);
    if(error) return next(error);
    const {email,password} = value;
    const User = mongoose.model('user');
    User.findOne({email:email})
    .then((user)=>{
        if(user){
            let correct = user.comparePassword(password);
            if(correct){
                const token = user.generateToken(secret['jwtSecret']);
                user.refreshToken = token.refreshToken;
                user.save();
                return res.status(200).send(token);            }
        }
        res.status(400).send('Invalid Username or Password');
    }).catch(error=>{
        res.status(500);
        return next(error);
    })
}


exports.logout = (req,res,next) => {

}

exports.refreshToken = (req,res,next) =>{

}


exports.verifyAccount = (req,res,next) =>{
    
}