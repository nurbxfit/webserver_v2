const mongoose = require('mongoose');
const { dbLogger } = require('../helper/logger');
const {mongoURL} = require('./config');

module.exports = function(){
    
    mongoose.connect(mongoURL,{useNewUrlParser:true});
    const db = mongoose.connection;
    db.on('error',(error)=>console.error(error.message,error))
    db.once('open',function(){
        console.log('We are connected to Database')
        initDBContent();
    });
}


/**
 here we initialize DB content, with dummy roles, and user.
 */
function initDBContent(){
    const Role = mongoose.model('role');
    const User = mongoose.model('user');
    const Profile = mongoose.model('profile');

    //check if thereis already content in DB, if not create one

    Role.findOne()
    .then(role=>{
        if(!role){
            //create
            const admin = new Role({
                layer: 0,
                role_name: 'admin',
            })

            return admin.save();
        }
    }).then(role=>{
        return User.findOne()
        .then(user=>{
            if(!user){
            const user1 = new User({
                username: 'admin',
                email : 'roo@toor.net',
                password : 'password123',
                unhashpassword: 'password123',
            });
            return user1.save();
            }
        }).then(user1=>{
            role.users = [user1._id];
            role.save();
            return user1;
        })

    }).then(user=>{
        Profile.findOne()
        .then(profile=>{
            if(!profile){
                const profile1 = new Profile({
                    name: 'admin',
                    age: 20,
                    sex: 'male',
                    phone: '99999999999',
                    state: 'unknown',
                    user : user._id,
                })
                return profile1.save();
            }
        })
    }).then(profile=>{
        console.log('Done')
        dbLogger.info('created!!');
    }).catch(error=>{
        dbLogger.error(error);
    })
}