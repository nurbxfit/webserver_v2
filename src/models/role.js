const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const RoleSchema = new Schema({
    layer: {type:Number,required: true},
    role_name: {type:String, required: true},
    users : [{type:ObjectId, ref:'users'}],
});

exports.Role = mongoose.model('role',RoleSchema);

exports.validate = (role) =>{
    const Schema = Joi.Schema({
        layer : Joi.number().integer().min(0).max(100).required(),
        role_name: Joi.string().required().min(50).alphanum(),
    })
    return Joi.validate(role,Schema);
}