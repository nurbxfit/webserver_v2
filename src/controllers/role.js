const mongoose = require('mongoose');
const {validate, Role} = require('../models/role');
 
//get list of roles
exports.get = async (req,res,next) =>{
    try{
        const Role = mongoose.model('role');
        const roles = await Role.find();
        if(!roles) { res.status(404); return next(); }  
        res.status(200).send(roles);    
    }catch(error){
        return next(error);
    }
}

/*
    receive : {layer: Number, role_name: String},
    and create it.
*/
exports.create = (req,res,next) =>{
    const {error,role} = validate(req.body);
    if(error){
        return next(error);
    } 
    const newRole = new Role(role);
    newRole.save()
    .then((role)=>{
        res.status(200).send(role);
    }).catch(error=>{
        return next(error);
    })
}

exports.update = async (req,res,next) => {
    console.log(req)
}


exports.delete = async (req,res,next) =>{
    console.log(req)
}

exports.assign = async (req,res,next) => {
    console.log(req)
}

exports.detach = async (req,res,next) => {
    console.log(req)
}