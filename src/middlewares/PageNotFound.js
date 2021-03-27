const mongoose = require('mongoose');
const {
    dbLogger,
    validationLogger,
    securityLogger,
    logger 
} = require('../helper/logger');

exports.pageNotFound = (req,res,next) => {
    const error = new Error(`Not Found - 404`)
    res.status(404);
    res.send({error: error.message})
}

exports.errorLogger = (error,req,res,next)=>{
    const client_ip = req.headers['x-fowarded-for'] || req.connection.remoteAddress;
    const infopayload = {
        Info: error.name,
        origin: {
            address: client_ip,
            method : req.method,
            path   : req.path,
            agent  : req.headers['user-agent'],
            timestamps: new Date(),
        },
        details: error.message
    }
    if(error){
        if(error instanceof mongoose.Error){
            dbLogger.error(infopayload);
            res.status(500);
            return res.send(error.message);
        }
        switch(error.name){
            case 'ValidationError' : {
                validationLogger.error(infopayload);
                res.status(400);
                return res.send(error.message)
            }  
            case 'unauthorizedError' : {
                securityLogger.error(infopayload);
                res.status(401);
                return res.send(error.message)
            }
            case 'forbiddenError' : {
                securityLogger.warn(infopayload);
                res.status(403);
                return res.send(error.message)
            }
            default: {
                logger.error(infopayload);
                res.status(500);
                return res.send(error.message)
            }
        }
    }else{
        next();
    }
}

// exports.genericError = (error,req,res,next)=>{
//     const statusCode = res.statusCode;
//     let msg ;
//     switch(statusCode){
//         case 500 : {msg = 'Internal Server Error' ; break;}
//         case 400 : {msg = 'Bad Request'; break;}
//         case 401 : {msg = 'Unauthorized'; break;}
//         case 403 : {msg = 'Forbidden'; break;}
//     }
//     return res.send({
//         error: msg,
//         stack: error,
//     });
// }