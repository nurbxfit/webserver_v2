const winston = require("winston");

module.exports = function(){
    process.on('unhandledRejection',(reject)=>{
        //throw as exception error
        throw reject; //catch by logger
    })
    //tell winston to handle exceptions
    winston.exceptions.handle(
        new winston.transports.File({
            filename: '.logs/commons/uncaughtExceptions.log'
        })
    )
}