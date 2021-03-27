const passport = require('passport');
const mongoose = require('mongoose');
const {UnauthorizedError,ForbiddenError} = require('../helper/customError');

const FindRoleHelper = (layer,req,res,next) =>{
    const Role = mongoose.model('role');
    const user = req.user;
    Role.find({$and:[{layer:layer},{users:user._id}]})
    .exec((error,users)=>{
        if(error){
            res.status(500);
            return (next(error))
        }
        if(users.length > 0){
            req.user.accessLayer = layer;
            return next();
        }
        res.status(403);
        return next(new ForbiddenError('you have no rights to access this information'));
    });
}

exports.RequireLogin = (req,res,next) => {
    passport.authenticate('jwt',{session:false},(error,user)=>{
        if(error){
            res.status(500)
            return next(error);
        }
        if(!user){
            res.status(401)
            return next(new UnauthorizedError('Please Login'));
        }
        req.user = user;
        return next()

    })(req,res,next);
}

exports.Layer0 = (req,res,next) =>  FindRoleHelper(0,req,res,next)

exports.Layer1 = (req,res,next) => FindRoleHelper(1,req,res,next)

exports.Layer1 = (req,res,next) => FindRoleHelper(2,req,res,next)



