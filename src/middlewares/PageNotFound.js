const {
    dbLogger,
    validationLogger,
    securityLogger,
    logger 
} = require('../helper/logger');

exports.pageNotFound = (req,res,next) => {
    const error = new Error(`Page Not Found - 404`)
    res.status(404);
    res.send({error: error.message})
}

exports.errorLogger = (error,req,res,next)=>{
    const client_ip = req.headers['x-fowarded-for'] || req.connection.remoteAddress;
    const infopayload = {
        Info: error.message,
        origin: {
            address: client_ip,
            method : req.method,
            path   : req.path,
            agent  : req.headers['user-agent'],
            timestamps: new Date(),
        },
        details: error
    }
    if(error){
        switch(error.message){
            case 'validation error' : {
                validationLogger.error(infopayload);
                res.status(400);
                return next(error);
            }
            case 'database error' : {
                dbLogger.error(infopayload);
                res.status(500);
                return next(error);
            }   
            case 'unauthorized' : {
                securityLogger.error(infopayload);
                res.status(401);
                return next(error);
            }
            case 'forbidden' : {
                securityLogger.warn(infopayload);
                res.status(403);
                return next(error);
            }
            default: {
                logger.error(infopayload);
                res.status(500);
                return next(error);
            }
        }
    }else{
        next();
    }
}

exports.genericError = (error,req,res,next)=>{
    const statusCode = res.statusCode;
    let msg ;
    switch(statusCode){
        case 500 : {msg = 'Internal Server Error' ; break;}
        case 400 : {msg = 'Bad Request'; break;}
        case 401 : {msg = 'Unauthorized'; break;}
        case 403 : {msg = 'Forbidden'; break;}
    }
    return res.send({
        error: msg,
    });
}