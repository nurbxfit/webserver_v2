const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt   = require('jsonwebtoken');
const Joi = require('joi');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const Profile = require('./profile');


    

const UserSchema = new Schema({
    username    : {type:String,required:true,minlength:2,maxlength:50,trim:true},
    email       : {type:String,required:true,minlength:5,maxlength:255,trim:true},
    password    : {type:String,required:true,minlength:5,maxlength:1024},
    verified    : {type:Boolean,default:false},
    refreshToken: {type:String},
    verifyHash  : {type:String},
    resetToken  : {stype:String},
    unhashpassword: {type:String},
})

UserSchema.pre('save',async function(){
    // const hash = bcrypt.hashSync(user.password,10);
    const {unhashpassword} = this;
    if(unhashpassword){
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(unhashpassword,salt);
        this.unhashpassword = undefined;
        this.password = hash;
        console.log('hashed:',this.password);
        // then it will call next()
    }
})


UserSchema.methods.createProfile = async function(profile,callback){
    const user = this;
    const {error,validated} = validateProfile(profile);
    if(error){
        return callback(error);
    }
    try{
        validated.user = user._id;
        const userprofile = new Profile(validated);
        userprofile.save(function(error,created){
            if(error){
                return callback(error);
            }
            if(created){
                return callback(null,created)
            }
            callback(null,null);
        });
    }catch(e){
        callback(e);
    }

}

/**
 * return true if password correct
 */
UserSchema.methods.comparePassword = async function(password){
    const user = this;
    return await bcrypt.compare(password,user.password); 
}

UserSchema.methods.generateToken = function(secret,duration){
    const expired = duration || '24h';
    const user = this;
    const body = {
        _id: user._id,
        email: user.email,
        name : user.name,     
    }
    const accessToken = jwt.sign(body,secret,{expiresIn:expired});
    const refreshToken = jwt.sign(body,secret);
    return {accessToken,refreshToken};
}

UserSchema.methods.compareToken = function(rftoken){
	const user = this;
	const isSame = (user.refreshToken === rftoken) ? true : false ;
	return isSame;
}

exports.User = mongoose.model('user',UserSchema);

exports.validateUser = function(user){
    const Schema = Joi.object({
        username: Joi.string().alphanum().min(2).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        // password: Joi.string().min(5).max(255).required(),
    })
    if(!user.password){
        return Schema.validate(user)
    }
    const extendedSchema = Schema.append({
        password: Joi.string().min(5).max(255).required(),
    })
    return extendedSchema.validate(user);
}

const validateProfile = function(profile){
    const stateName = [ 
        'Johor', 'Kedah', 'Kelantan','Malacca', 'Negeri Sembilan', 'Pahang',
        'Penang', 'Perak', 'Perlis', 'Sabah', 'Serawak', 'Selangor','Terengganu',
        'Kuala Lumpur', 'Labuan', 'Putrajaya'
    ];
    const phoneRegex = new RegExp(/^\+[0-9]{1,3}[0-9]{4,14}(?:x.+)?$/);
    const sexRegex = new RegExp(/^(male|female|others)/);
    const stateRegex = new RegExp('^('+stateName.join('|')+')$');
    // const mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    //phone number format: +60123456789
    const Schema = Joi.object({
        name : Joi.string().min(3).max(50).required(),
        phone: Joi.string().regex(phoneRegex).required(),
        sex : Joi.string().regex(sexRegex).required(),
        state : Joi.string().regex(stateRegex).required(),
        age : Joi.number().integer().min(12).max(99).required(),
    });

    return Schema.validate(profile);

}

exports.validateProfile = validateProfile;
