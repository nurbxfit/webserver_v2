const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const secret = require('../configs/secret');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const generatePassword = require('../helper/generatePassword');
const {User} = require('../models/user');
const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret['jwtSecret'],
}

module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

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

    // passport.use(new GoogleStrategy({
    //     clientID: secret['googleClientID'],
    //     clientSecret: secret['googleClientSecret'] ,
    //     callbackURL: "http://localhost:5000/auth/google/redirect"
    
    // },function(token,tokenSecret,profile,done){
    //     // console.log('GoogleProfile:',profile);
    //     const password = generatePassword()
    //     User.findOne({
    //         googleId:profile.id,
    //     }).then((existingUser)=>{
    //         if(!existingUser){
    //             const user = new User({
    //                 username:profile._json.given_name,
    //                 email: profile._json.email,
    //                 password: password,
    //                 unhashpassword: password,
    //                 verified: profile._json.email_verified
    //             });
    //             return user.save();
    //         }
    //         return existingUser;

    //     }).then(user=>{
    //         //
    //         return done(null,user);
    //     }).catch(error=>{
    //         console.error(error);
    //         done(error,null);
    //     })
        
    // }))



}