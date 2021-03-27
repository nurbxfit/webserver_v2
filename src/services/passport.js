const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const secret = require('../configs/secret');


const {User} = require('../models/user');
const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret['jwtSecret'],
}

module.exports = (passport) => {
    passport.use(new JWTStrategy(
    opts,
    async function(jwt_user,done){
        User.findOne({_id:jwt_user._id})
        .exec(function(error,user){
            if(error) return done(error,false);
            if(user) return done(null,user);
            else return done(null,false);
        })
    }
));

}