const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const ProfileSchema = new Schema({
    name    : {type:String,minLength:3,maxLength:50,required:true,trim:true},
    age     : {type:Number,required:true,min:12,max:99},
    sex     : {type:String,minLength:4,maxLength:8,required:true,lowercase:true,trim:true},
    phone   : {type:String,minLength:7,maxLength:15,required:true,trim:true},
    state   : {type:String,required:true,trim:true},
    user    : {type:ObjectId, ref:'user'},

},{timestamps:true});

exports.Profile = mongoose.model('profile',ProfileSchema);