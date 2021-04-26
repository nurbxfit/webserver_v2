
const Joi = require('joi');
const mongoose = require('mongoose');
const { ForbiddenError } = require('../helper/customError');
const { validateProfile, validateUser } = require('../models/user');

exports.get = (req,res,next) => {
    const User = mongoose.model('user');
    User.find().select('username email').then(user=>{
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
    .populate('user','username email') //exclude -password
    .then(user=>{
        if(!user) return res.status(404).send('Nothing to show you');
        return res.status(200).send(user);
    }).catch(error=>{
        res.status(500)
        next(error);
    })
}


/*
POST:SEARCH
searching will list suggesting user that matches search terms.
search based on profile, such as their name and region.
input: {
    "terms" : {
        "name": "alibaba"
    },
    "orderBy" : "name",
    "isAscending" : "true",
    "limit" : 10,
    "offset" : 0
}
output: [
    {
        "name": "alibaba",
        "age" : 21,
        "sex" : "male"
        "user":{
            "_id" : "1231414151515521",
            "username" : "alfonsoCarrot123",
            "email" : "alibaba@aliexpress.com"
        }
    }
]
- frontend will use that info to show simple suggestion card list.
- frontend will make use of user.id make it hyperlink.
- when people click, it go to: /user/:id/profile
*/
exports.search = (req,res,next) => {
    const Schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(50)
    })
    const {error,value} = Schema.validate(req.body.terms);

    if(error) return next(error);
    const {
        orderBy='name', 
        isAscending='true', 
        limit=10, 
        offset=0
    } = req.body;
    let sort = {};
    sort[orderBy] = (isAscending === 'true') ? 1 : -1 ;

    const {name} = value;
    const query= {name:name};
    //find Profile match given name.
    const Profile = mongoose.model('profile');
    Profile.find(query)
    .select('name age sex')
    .populate('user','username email')
    .limit(parseInt(limit))
    .skip(parseInt(offset)*parseInt(limit))
    .sort(sort)
    .then(async (user)=>{
        const total = await Profile.countDocuments(query)
        if(!user) return res.status(404).send('Nothing to show you');
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/parseInt(limit)),
            offset: parseInt(offset),
            limit: parseInt(limit),
            user
        });
    }).catch(error=>{
        res.status(500)
        next(error);
    })
}


/**
 * update user account
 * only request user can update their own account
 * we validate the request body
 * if sender send together the password, (means trying to update password)
 * else just update the username and email
 * when we set the password value in user,
 * when we save it, it will call the mongoose 'save' middleware to hash the password 
 * INPUT: {
                "username": "admin",
                "email": "roo@toor.net"
            }
    OUTPUT: 200 ok "updated successfully"
 */
exports.update = (req,res,next) =>{
    const {error,value} = validateUser(req.body);
    if(error) return next(error);

    const {username,email,password} = value;
    const reqUser = req.user;

    const User = mongoose.model('user');
    //check if usename or email already taken by other user.
    User.findOne({$or:[{email:email},{username:username}]})
    .then( async user=>{
         /*
            if thereis a user with that creds and it is not same person as request:
                - then it means they trying to change creds similar to someone else
            else (case): 
                -(1) user==undefined ; means nobody whit that same creds
                -(2) or user = defined, but id==match, means the same person.

            in else case(1){
                 undefined user automatic userid comparison also invalid
                 so need to find user base on reqUser._id, then update.
            }
            in else case(2){
                user defined && id match, so simply use that user and update the value.
            }
        */
        if(user && user._id.toString() !== reqUser._id.toString()){
            // cannot update creds same as someone else
            return res.status(200).send('username or email already taken');
        }

        if(!user){
            const user = await User.findById(reqUser._id);
        }
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

       
    }).then(updated=>{
        res.status(200).send('updated successfully');
    })
    .catch(error=>{
        res.status(500);
        next(error);
    })
}

/*
    update user profile.
    INPUT:{
        "name" : "someone",
        "age"  : 25,
        "sex"  : "MALE",
        "phone" : "+60123456789", //refer regex in models/user.js
        "state" : "Kedah",
    }
    OUTPUT: 200 OK "Profile updated!"
*/
exports.updateProfile = (req,res,next) => {
    const {error,value} = validateProfile(req.body);
    
    if(error) return next(error);

    const {name,age,sex,phone,state} = value;
    const reqUser = req.user;
    const Profile = mongoose.model('profile');
    Profile.findOne({user:reqUser._id})
    .then(profile=>{
        if(!profile){
            //create new if we can't find one
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
