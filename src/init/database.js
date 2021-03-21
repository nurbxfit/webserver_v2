const mongoose = require('mongoose');
const {mongoURL} = require('./config');

module.exports = function(){
    
    mongoose.connect(mongoURL,{useNewUrlParser:true});
    const db = mongoose.connection;
    db.on('error',(error)=>console.error(error.message,error))
    db.once('open',function(){console.log('We are connected to Database')});
}