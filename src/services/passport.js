const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = mongoose.model('user');
const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey = process.env.RF_SECRET,
}

passport.use(new JWTStrategy(
    opts,
    async function(jwt_user,done){
        User.findOne({_id:jwt_user._id}).populate('roles','role layer')
        .exec(function(error,user){
            if(error) return done(error,false);
            if(user) return done(null,user);
            else return done(null,false);
        })
    }
));