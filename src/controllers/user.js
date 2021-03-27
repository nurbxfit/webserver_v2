
const mongoose = require('mongoose');
const { ForbiddenError } = require('../helper/customError');
const { validateProfile } = require('../models/user');

exports.get = (req,res,next) => {
    const User = mongoose.model('user');
    User.find().then(user=>{
        if(!user) return res.status(404).send('Nothing to show you');
        return res.status(200).send(user);
    }).catch(error=>{   
        res.status(500)
        next(error);
    })
}


exports.getById = (req,res,next) => {
    const {userId} = req.params;
    const Profile = mongoose.model('profile');
    Profile.findOne({user:userId})
    .select('name age sex phone state -_id') //exclude _id
    .populate('user','username email -password') //exclude -password
    .then(user=>{
        if(!user) return res.status(404).send('Nothing to show you');
        return res.status(200).send(user);
    }).catch(error=>{
        res.status(500)
        next(error);
    })
}

exports.search = (req,res,next) => {
    console.log('Something');
}


/**
 * update user account
 * only request user can update their own account
 * we validate the request body
 * if sender send together the password, (means trying to update password)
 * else just update the username and email
 * when we set the password value in user,
 * when we save it, it will call the mongoose 'save' middleware to hash the password 
 */
exports.update = (req,res,next) =>{
    const {error,validUser} = validUser(req.body);
    if(error) return next(error);

    const {username,email,password} = validUser;
    const reqUser = req.user;

    const User = mongoose.model('user');
    User.findById(reqUser._id).then(user=>{
        user.username = username;
        user.email = email;
        /*
        if we dont receive password back from validation, 
        means req.body don't have password.
        so we simply just update the username and email;
        */
        if(password){
            user.unhashpassword = password;
        }
        return user.save();
        //throw new ForbiddenError('Trying to access forbidden information');
    }).then(updated=>{
        res.status(200).send('updated successfully');
    }).catch(error=>{
        res.status(500);
        next(error);
    })
}

exports.updateProfile = (req,res,next) => {
    const {error,validProfile} = validateProfile(req.body);
    
    if(error) return next(error);

    const {name,age,sex,phone,state} = validProfile;
    const reqUser = req.user;
    const Profile = mongoose.model('profile');
    Profile.findOne({user:reqUser._id})
    .then(profile=>{
        if(!profile){
            //create new
            const newProfile = new Profile({
                name,
                age,
                sex,
                phone,
                state
            });
            return newProfile.save();
        }
        profile.name = name;
        profile.age = age;
        profile.sex = sex;
        profile.state = state;
        profile.phone = phone;
        return profile.save();
    }).then(saved=>{
        res.status(200).send('Profile updated!');
    }).catch(error=>{
        res.status(500);
        next(error);
    })

}
